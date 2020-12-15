import { InputText } from 'primereact/inputtext';
import { useRef } from 'react';

function Input(props) {
    const textRef = useRef(null)

    return (
        <span className="p-input-icon-right">
            <i id="name" className="pi pi-plus" onClick={e => textRef.current.value && props.onSubmit(textRef.current.value)} />
            <InputText ref={textRef} onKeyDown={e => {
                if (textRef.current.element.value && e.key === 'Enter') {
                    props.onSubmit(textRef.current.element.value)
                    textRef.current.element.value = ''
                }
            }} placeholder='Adicione um nome' />
        </span>
    );
}

export default Input;
