package com.nathanmiller.fishingadventure;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(android.os.Bundle savedInstanceState) {
        registerPlugin(FishingAdventurePurchasesPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
