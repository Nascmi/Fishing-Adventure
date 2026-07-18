import { GAME_CONFIG } from '../data/config'
import { fish } from '../data/fish'
import { rods } from '../data/rods'
const KEY='fishing-adventure-save-v1'
export const newGame = () => ({version:1,coins:GAME_CONFIG.startingCoins,inventory:[],ownedRods:['old'],equippedRod:'old',collection:{},stats:{totalCaught:0,totalCoinsEarned:0,totalCasts:0,escaped:0,largestFish:null,rarestFish:null}})
const rarities=['common','uncommon','rare','epic','legendary']
export function validateSave(raw) {
  const base=newGame()
  if (!raw || typeof raw!=='object') return base
  const validFish=new Set(fish.map(f=>f.id)), validRods=new Set(rods.map(r=>r.id))
  const owned=Array.isArray(raw.ownedRods)?raw.ownedRods.filter(id=>validRods.has(id)):base.ownedRods
  if (!owned.includes('old')) owned.unshift('old')
  return {...base,...raw,coins:Number.isFinite(raw.coins)&&raw.coins>=0?Math.floor(raw.coins):base.coins,inventory:Array.isArray(raw.inventory)?raw.inventory.filter(i=>i&&validFish.has(i.fishId)&&typeof i.catchId==='string'):[],ownedRods:owned,equippedRod:owned.includes(raw.equippedRod)?raw.equippedRod:'old',collection:raw.collection&&typeof raw.collection==='object'?raw.collection:{},stats:{...base.stats,...(raw.stats||{})}}
}
export function loadGame(){try{return validateSave(JSON.parse(localStorage.getItem(KEY)))}catch{return newGame()}}
export function saveGame(state){try{localStorage.setItem(KEY,JSON.stringify(state))}catch{/* Play remains available if storage is unavailable. */}}
export function clearGame(){try{localStorage.removeItem(KEY)}catch{}}
export const rarityRank = rarity => Math.max(0,rarities.indexOf(rarity))
