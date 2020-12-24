import { InputNumber } from 'primereact/inputnumber';
import { FaRegStopCircle, FaPlay } from "react-icons/fa";
import { Button } from 'primereact/button';
import { useEffect, useState } from 'react';
import './App.css';
import Input from './components/Input';

const orderByDeads = (list) => {
  const deads = list.filter(item => item.dead)
  const alives = list.filter(item => !item.dead)
  return [...alives, ...deads]
}

// [{ name, guess, hasDone?, lifes, dead }]
const defaultLifes = 3

function ListItem(props) {
  const { lifes, name, guess = 0, hasDone = 0, dead, onHasDoneChange, onGuessChange, isPlaying, onLifeChange } = props

  return <div className={`p-d-flex p-flex-column p-jc-center item-wrapper p-mb-2 ${dead ? 'disabled' : ''}`}>
    <div className="p-d-flex p-jc-between p-ai-center">
      <Button disabled label={`${lifes}`} onClick={() => lifes >= 0 && onLifeChange()} icon="pi pi-heart" className="p-button-rounded p-button-help p-button-text" />
      <h2>{name}</h2>

      {isPlaying ? <Button
        icon='pi pi-question-circle'
        label={`${guess || 0}`}
        disabled
        className="p-button-rounded p-button-text p-as-center" /> :
        <InputNumber disabled={dead} id="vertical" value={guess} onValueChange={(e) => onGuessChange(e.value)} mode="decimal" showButtons buttonLayout="vertical" style={{ width: '3rem' }} decrementButtonClassName="p-button-secondary" incrementButtonClassName="p-button-secondary" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
      }
    </div>

    {
      isPlaying && <div className="p-d-flex p-jc-center couting-point-wrapper">
        <Button onClick={() => hasDone && onHasDoneChange(Number(hasDone) - 1)} icon="pi pi-minus" className="p-button-outlined p-button-danger p-as-center" />
        <Button
          label={`${hasDone}`}
          icon='pi pi-check-circle'
          disabled
          style={{ color: 'black' }}
          className="p-button-rounded p-button-text p-as-start p-button-lg" />
        <Button onClick={() =>
          onHasDoneChange(Number(hasDone) + 1)
        } icon="pi pi-plus" className="p-button-outlined p-button-success p-as-center" />
      </div>
    }
  </div>
}

function App() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [list, setList] = useState([])

  // reset points when stop previous play
  useEffect(() => {
    if (!isPlaying && list.length) {
      setList(crrList => {
        const listResetedAndOrdered = orderByDeads(crrList.map(item => ({ ...item, guess: 0, hasDone: 0 })))
        return listResetedAndOrdered
      })
    }
    // eslint-disable-next-line
  }, [isPlaying])

  const handleStartAndStopPlay = () => {
    if (isPlaying) {
      // check if anyone has to die
      setList(list.map(item => {
        if (!item.lifes) return item

        if (Number(item.hasDone) !== Number(item.guess)) {
          const playerWithLessLife = { ...item, lifes: item.lifes - 1 }
          if (Number(item.lifes) === 1) {
            alert(`${item.name} Morreeeeeuuu. Mete o pé porra.`)
            return { ...playerWithLessLife, dead: true }
          }

          return playerWithLessLife
        }

        return item
      }))
    }

    setIsPlaying(!isPlaying)
  }

  return (
    <>
      <div className='app-wrapper'>
        <div className={`p-d-flex ${isPlaying ? 'p-jc-center' : 'p-jc-around'} header-to-start`}>
          {!isPlaying && <Input onSubmit={value => setList(orderByDeads([...list, { name: value, guess: 0, lifes: defaultLifes, hasDone: 0 }].sort((a, b) => a.name - b.name)))} />}
          {!!list.length && <Button onClick={handleStartAndStopPlay} className={`${isPlaying ? 'p-button-outlined p-button-danger' : ''}`}>{isPlaying ? <FaRegStopCircle /> : <FaPlay />}</Button>}
        </div>

        {
          list && list.map((data, idx) => {
            const handleGuesChange = guess => setList(list.map((item, _idx) => {
              return idx === _idx ? { ...item, guess } : item
            }))
            const handleLifeChange = () => setList(list.map((item, _idx) => {
              return idx === _idx ? { ...item, lifes: item.lifes - 1 } : item
            }))
            const handleHasDoneChange = (currentPoints) => setList(list.map((item, _idx) => {
              return idx === _idx ? { ...item, hasDone: currentPoints } : item
            }))

            return <ListItem
              {...{ ...data, isPlaying }}
              onGuessChange={handleGuesChange}
              onLifeChange={handleLifeChange}
              onHasDoneChange={handleHasDoneChange}
              key={data.name}
            />
          })
        }

      </div>
      <div className='p-d-flex p-jc-center footer'>
        <Button label='Resetar' onClick={() => setList(list.map(({ dead, ...item }) => ({ ...item, lifes: 3, guess: 0, hasDone: 0 })))} className='p-button-outlined' />
      </div>
    </>
  );
}

export default App;
