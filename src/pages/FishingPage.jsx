import { useEffect, useRef, useState } from 'react'
import { GAME_CONFIG } from '../data/config'
import { locations } from '../data/locations'
import { getRod } from '../data/rods'
import { useGame } from '../hooks/useGame'
import { randomDelay, selectFish } from '../utils/fishingEngine'
import { makeCatch } from '../utils/valueCalculator'
import RarityBadge from '../components/RarityBadge'
const copy={ready:'The water is calm. Cast when you’re ready.',casting:'A smooth cast across the pond…',waiting:'Watch the bobber. Something may be near.',biting:'A bite! Reel in now!',escaped:'The fish slipped away.',caught:'A fine catch from Willow Pond.'}
export default function FishingPage(){const {game,actions}=useGame();const [state,setState]=useState('ready');const [recent,setRecent]=useState(null);const timers=useRef([])
  const later=(fn,ms)=>{const id=setTimeout(fn,ms);timers.current.push(id)}
  const clear=()=>{timers.current.forEach(clearTimeout);timers.current=[]}
  useEffect(()=>clear,[])
  const cast=()=>{if(state!=='ready')return;clear();setRecent(null);setState('casting');actions.recordCast();later(()=>{setState('waiting');later(()=>{setState('biting');later(()=>{setState(s=>{if(s==='biting'){actions.recordEscape();later(()=>setState('ready'),GAME_CONFIG.resetDelayMs);return'escaped'}return s})},GAME_CONFIG.reactionMs)},randomDelay(GAME_CONFIG.waitMinMs,GAME_CONFIG.waitMaxMs))},GAME_CONFIG.castingMs)}
  const reel=()=>{if(state!=='biting')return;clear();const caught=makeCatch(selectFish(getRod(game.equippedRod).chances,locations[0].fishIds));actions.addCatch(caught);setRecent(caught);setState('caught');later(()=>setState('ready'),GAME_CONFIG.resetDelayMs)}
  const active=['casting','waiting'].includes(state)
  return <main className="fishing-page"><section className={`lake ${state}`}><div className="sun"/><div className="hills far"/><div className="hills near"/><div className="shore"/><div className="water"><div className="bobber"><i/></div><div className="ripples"/></div><div className="scene-copy"><span className="eyebrow">Today’s fishing spot</span><h2>Willow Pond</h2><p>A gentle breeze moves through the reeds.</p></div></section><section className="action-card"><div className={`status ${state}`}><span className="status-dot"/><div><b>{state==='biting'?'Fish on!':state==='caught'?'Caught!':state==='escaped'?'So close…':'At the water'}</b><p>{copy[state]}</p></div></div>{recent&&<article className="catch-card"><div className="fish-mark">≈</div><div><span>New catch</span><h3>{recent.name}</h3><RarityBadge rarity={recent.rarity}/></div><div className="catch-numbers"><b>{recent.weight} lb</b><span>{recent.value} coins</span></div></article>}<button className={`primary-button ${state==='biting'?'urgent':''}`} disabled={active||state==='caught'||state==='escaped'} onClick={state==='biting'?reel:cast}>{state==='biting'?'Reel In!':active?'Line is out…':'Cast Line'}</button></section></main>}
