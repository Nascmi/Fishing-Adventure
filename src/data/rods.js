export const rods = [
  {id:'old',name:'Old Fishing Rod',description:'Worn, dependable, and ready for the pond.',price:0,chances:{common:75,uncommon:20,rare:4,epic:.9,legendary:.1}},
  {id:'fiberglass',name:'Fiberglass Rod',description:'A forgiving rod with a little more reach.',price:250,chances:{common:65,uncommon:25,rare:8,epic:1.8,legendary:.2}},
  {id:'carbon',name:'Carbon Rod',description:'Light and sensitive for elusive catches.',price:1500,chances:{common:52,uncommon:29,rare:14,epic:4.4,legendary:.6}},
  {id:'master',name:'Master Angler Rod',description:'Superb balance for the finest fish in the pond.',price:7500,chances:{common:38,uncommon:31,rare:21,epic:8.5,legendary:1.5}}
]
export const getRod = id => rods.find(rod => rod.id === id) || rods[0]
