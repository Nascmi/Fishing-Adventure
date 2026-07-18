import Icon from './Icon'

const items = [
  ['fishing', 'Fishing'],
  ['inventory', 'Inventory'],
  ['shop', 'Rod Shop'],
  ['collection', 'Collection'],
]

export default function NavBar({ page, setPage }) {
  return <nav className="nav" aria-label="Main navigation">{items.map(([id, label]) => <button className={page === id ? 'active' : ''} onClick={() => setPage(id)} key={id} aria-current={page === id ? 'page' : undefined}><Icon name={id} />{label}</button>)}</nav>
}
