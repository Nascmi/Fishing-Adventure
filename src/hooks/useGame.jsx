import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { clearGame, loadGame, newGame, rarityRank, saveGame } from '../services/saveService'
import { getRod } from '../data/rods'
const GameContext=createContext(null)
export function GameProvider({children}) {
  const [game,setGame]=useState(loadGame)
  useEffect(()=>saveGame(game),[game])
  const actions=useMemo(()=>({
    recordCast:()=>setGame(g=>({...g,stats:{...g.stats,totalCasts:g.stats.totalCasts+1}})),
    recordEscape:()=>setGame(g=>({...g,stats:{...g.stats,escaped:g.stats.escaped+1}})),
    addCatch:item=>setGame(g=>{const old=g.collection[item.fishId]||{count:0,largestWeight:0};const largest=!g.stats.largestFish||item.weight>g.stats.largestFish.weight?item:g.stats.largestFish;const rarest=!g.stats.rarestFish||rarityRank(item.rarity)>rarityRank(g.stats.rarestFish.rarity)?item:g.stats.rarestFish;return {...g,inventory:[item,...g.inventory],collection:{...g.collection,[item.fishId]:{count:old.count+1,largestWeight:Math.max(old.largestWeight,item.weight)}},stats:{...g.stats,totalCaught:g.stats.totalCaught+1,largestFish:largest,rarestFish:rarest}}}),
    sell:id=>setGame(g=>{const item=g.inventory.find(i=>i.catchId===id);if(!item)return g;return {...g,coins:g.coins+item.value,inventory:g.inventory.filter(i=>i.catchId!==id),stats:{...g.stats,totalCoinsEarned:g.stats.totalCoinsEarned+item.value}}}),
    sellAll:()=>setGame(g=>{const total=g.inventory.reduce((n,i)=>n+i.value,0);return {...g,coins:g.coins+total,inventory:[],stats:{...g.stats,totalCoinsEarned:g.stats.totalCoinsEarned+total}}}),
    buyRod:id=>setGame(g=>{const rod=getRod(id);if(g.ownedRods.includes(id)||g.coins<rod.price)return g;return {...g,coins:g.coins-rod.price,ownedRods:[...g.ownedRods,id]}}),
    equipRod:id=>setGame(g=>g.ownedRods.includes(id)?{...g,equippedRod:id}:g),
    reset:()=>{clearGame();setGame(newGame())}
  }),[])
  return <GameContext.Provider value={{game,actions}}>{children}</GameContext.Provider>
}
export const useGame=()=>useContext(GameContext)
