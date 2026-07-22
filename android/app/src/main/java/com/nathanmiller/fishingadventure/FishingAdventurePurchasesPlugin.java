package com.nathanmiller.fishingadventure;

import com.android.billingclient.api.AcknowledgePurchaseParams;
import com.android.billingclient.api.BillingClient;
import com.android.billingclient.api.BillingClientStateListener;
import com.android.billingclient.api.BillingFlowParams;
import com.android.billingclient.api.BillingResult;
import com.android.billingclient.api.PendingPurchasesParams;
import com.android.billingclient.api.ProductDetails;
import com.android.billingclient.api.Purchase;
import com.android.billingclient.api.PurchasesUpdatedListener;
import com.android.billingclient.api.QueryProductDetailsParams;
import com.android.billingclient.api.QueryPurchasesParams;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicBoolean;

@CapacitorPlugin(name = "FishingAdventurePurchases")
public class FishingAdventurePurchasesPlugin extends Plugin implements PurchasesUpdatedListener {
    private BillingClient billingClient;
    private final Set<String> catalogProductIds = new HashSet<>();
    private final Map<String, ProductDetails> productDetailsById = new HashMap<>();
    private PluginCall activePurchaseCall;

    @Override
    public void load() {
        billingClient = BillingClient.newBuilder(getContext())
            .setListener(this)
            .enablePendingPurchases(PendingPurchasesParams.newBuilder().enableOneTimeProducts().build())
            .enableAutoServiceReconnection()
            .build();
    }

    @Override
    protected void handleOnDestroy() {
        if (billingClient != null) billingClient.endConnection();
    }

    @PluginMethod
    public void initialize(PluginCall call) {
        setCatalogIds(call.getArray("productIds"));
        withBillingConnection(call, () -> queryProducts(call));
    }

    @PluginMethod
    public void restore(PluginCall call) {
        setCatalogIds(call.getArray("productIds"));
        withBillingConnection(call, () -> queryOwnedProducts(call, "restored"));
    }

    @PluginMethod
    public void purchase(PluginCall call) {
        String productId = call.getString("productId");
        if (productId == null || !catalogProductIds.contains(productId)) {
            call.reject("This product is not in the Fishing Adventure catalog.");
            return;
        }
        if (activePurchaseCall != null) {
            call.reject("Another purchase is already in progress.");
            return;
        }
        withBillingConnection(call, () -> launchPurchase(call, productId));
    }

    private void setCatalogIds(JSArray ids) {
        catalogProductIds.clear();
        if (ids == null) return;
        try {
            for (int index = 0; index < ids.length(); index++) {
                String id = ids.getString(index);
                if (id != null && !id.isBlank()) catalogProductIds.add(id);
            }
        } catch (Exception ignored) {}
    }

    private void withBillingConnection(PluginCall call, Runnable ready) {
        if (billingClient.isReady()) {
            ready.run();
            return;
        }
        billingClient.startConnection(new BillingClientStateListener() {
            @Override
            public void onBillingSetupFinished(BillingResult result) {
                if (result.getResponseCode() == BillingClient.BillingResponseCode.OK) ready.run();
                else call.reject("Google Play Billing unavailable: " + result.getDebugMessage());
            }

            @Override
            public void onBillingServiceDisconnected() {
                // Automatic reconnection is enabled for the next billing request.
            }
        });
    }

    private void queryProducts(PluginCall call) {
        List<QueryProductDetailsParams.Product> products = new ArrayList<>();
        for (String id : catalogProductIds) {
            products.add(QueryProductDetailsParams.Product.newBuilder()
                .setProductId(id)
                .setProductType(BillingClient.ProductType.INAPP)
                .build());
        }
        if (products.isEmpty()) {
            resolveCatalog(call, Collections.emptyList(), Collections.emptyList());
            return;
        }
        QueryProductDetailsParams params = QueryProductDetailsParams.newBuilder().setProductList(products).build();
        billingClient.queryProductDetailsAsync(params, (result, detailsResult) -> {
            if (result.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                call.reject("Could not load Google Play products: " + result.getDebugMessage());
                return;
            }
            productDetailsById.clear();
            for (ProductDetails details : detailsResult.getProductDetailsList()) {
                if (catalogProductIds.contains(details.getProductId())) productDetailsById.put(details.getProductId(), details);
            }
            queryOwnedProducts(call, "initialized");
        });
    }

    private void queryOwnedProducts(PluginCall call, String status) {
        QueryPurchasesParams params = QueryPurchasesParams.newBuilder().setProductType(BillingClient.ProductType.INAPP).build();
        billingClient.queryPurchasesAsync(params, (result, purchases) -> {
            if (result.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                call.reject("Could not restore Google Play purchases: " + result.getDebugMessage());
                return;
            }
            processPurchased(purchases,
                () -> resolveCatalog(call, new ArrayList<>(productDetailsById.values()), ownedIds(purchases), status),
                () -> call.reject("Google Play could not acknowledge an owned purchase."));
        });
    }

    private void launchPurchase(PluginCall call, String productId) {
        ProductDetails details = productDetailsById.get(productId);
        if (details == null) {
            call.reject("This product is not currently available from Google Play.");
            return;
        }
        BillingFlowParams.ProductDetailsParams.Builder item = BillingFlowParams.ProductDetailsParams.newBuilder().setProductDetails(details);
        ProductDetails.OneTimePurchaseOfferDetails offer = details.getOneTimePurchaseOfferDetails();
        if (offer == null && details.getOneTimePurchaseOfferDetailsList() != null && !details.getOneTimePurchaseOfferDetailsList().isEmpty()) {
            offer = details.getOneTimePurchaseOfferDetailsList().get(0);
        }
        if (offer != null && offer.getOfferToken() != null && !offer.getOfferToken().isBlank()) item.setOfferToken(offer.getOfferToken());
        BillingFlowParams params = BillingFlowParams.newBuilder().setProductDetailsParamsList(Collections.singletonList(item.build())).build();
        activePurchaseCall = call;
        BillingResult result = billingClient.launchBillingFlow(getActivity(), params);
        if (result.getResponseCode() != BillingClient.BillingResponseCode.OK) {
            activePurchaseCall = null;
            call.reject("Google Play could not start the purchase: " + result.getDebugMessage());
        }
    }

    @Override
    public void onPurchasesUpdated(BillingResult result, List<Purchase> purchases) {
        PluginCall call = activePurchaseCall;
        if (call == null) return;
        if (result.getResponseCode() == BillingClient.BillingResponseCode.USER_CANCELED) {
            activePurchaseCall = null;
            resolveStatus(call, "cancelled", Collections.emptyList());
            return;
        }
        if (result.getResponseCode() != BillingClient.BillingResponseCode.OK || purchases == null) {
            activePurchaseCall = null;
            call.reject("Google Play purchase failed: " + result.getDebugMessage());
            return;
        }
        boolean pending = purchases.stream().anyMatch(purchase -> purchase.getPurchaseState() == Purchase.PurchaseState.PENDING);
        if (pending) {
            activePurchaseCall = null;
            resolveStatus(call, "pending", ownedIds(purchases));
            return;
        }
        processPurchased(purchases, () -> {
            activePurchaseCall = null;
            queryOwnedProducts(call, "purchased");
        }, () -> {
            activePurchaseCall = null;
            call.reject("The purchase completed, but Google Play acknowledgement failed. Use Restore purchases to retry.");
        });
    }

    private void processPurchased(List<Purchase> purchases, Runnable complete, Runnable failed) {
        List<Purchase> needsAcknowledgement = new ArrayList<>();
        for (Purchase purchase : purchases) {
            if (purchase.getPurchaseState() == Purchase.PurchaseState.PURCHASED && isCatalogPurchase(purchase) && !purchase.isAcknowledged()) {
                needsAcknowledgement.add(purchase);
            }
        }
        if (needsAcknowledgement.isEmpty()) {
            complete.run();
            return;
        }
        AtomicInteger remaining = new AtomicInteger(needsAcknowledgement.size());
        AtomicBoolean anyFailure = new AtomicBoolean(false);
        for (Purchase purchase : needsAcknowledgement) {
            AcknowledgePurchaseParams params = AcknowledgePurchaseParams.newBuilder().setPurchaseToken(purchase.getPurchaseToken()).build();
            billingClient.acknowledgePurchase(params, result -> {
                if (result.getResponseCode() != BillingClient.BillingResponseCode.OK) anyFailure.set(true);
                if (remaining.decrementAndGet() == 0) {
                    if (anyFailure.get()) failed.run();
                    else complete.run();
                }
            });
        }
    }

    private boolean isCatalogPurchase(Purchase purchase) {
        return purchase.getProducts().stream().anyMatch(catalogProductIds::contains);
    }

    private List<String> ownedIds(List<Purchase> purchases) {
        Set<String> owned = new HashSet<>();
        for (Purchase purchase : purchases) {
            if (purchase.getPurchaseState() != Purchase.PurchaseState.PURCHASED) continue;
            for (String id : purchase.getProducts()) if (catalogProductIds.contains(id)) owned.add(id);
        }
        return new ArrayList<>(owned);
    }

    private void resolveCatalog(PluginCall call, List<ProductDetails> details, List<String> owned) {
        resolveCatalog(call, details, owned, "initialized");
    }

    private void resolveCatalog(PluginCall call, List<ProductDetails> details, List<String> owned, String status) {
        JSArray products = new JSArray();
        for (ProductDetails item : details) {
            ProductDetails.OneTimePurchaseOfferDetails offer = item.getOneTimePurchaseOfferDetails();
            if (offer == null && item.getOneTimePurchaseOfferDetailsList() != null && !item.getOneTimePurchaseOfferDetailsList().isEmpty()) offer = item.getOneTimePurchaseOfferDetailsList().get(0);
            if (offer == null) continue;
            JSObject product = new JSObject();
            product.put("id", item.getProductId());
            product.put("price", offer.getFormattedPrice());
            products.put(product);
        }
        JSObject response = new JSObject();
        response.put("status", status);
        response.put("products", products);
        response.put("ownedProductIds", new JSArray(owned));
        call.resolve(response);
    }

    private void resolveStatus(PluginCall call, String status, List<String> owned) {
        JSObject response = new JSObject();
        response.put("status", status);
        response.put("ownedProductIds", new JSArray(owned));
        call.resolve(response);
    }
}
