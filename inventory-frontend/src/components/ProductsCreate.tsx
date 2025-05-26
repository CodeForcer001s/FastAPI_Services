import { Wrapper } from "./Wrapper"
import { useState } from "react"
import type { FormEvent, ChangeEvent } from "react"
import { useNavigate } from 'react-router-dom'
import './ProductsCreate.css'

export const ProductsCreate = () => {
    const [name, setName] = useState<string>('')
    const [price, setPrice] = useState<string>('')
    const [quantity, setQuantity] = useState<string>('')
    const navigate = useNavigate()

    const submit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        await fetch('http://localhost:8000/products', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name,
                price,
                quantity
            })
        })

        await navigate(-1)
    }

    return (
        <Wrapper>
            <form className="product-form" onSubmit={submit}>
                <div className="input-container">
                    <input 
                        className="input-field" 
                        placeholder="Name"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                    />
                    <label className="field-label">Name</label>
                </div>

                <div className="input-container">
                    <input 
                        type="number" 
                        className="input-field" 
                        placeholder="Price"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPrice(e.target.value)}
                    />
                    <label className="field-label">Price</label>
                </div>

                <div className="input-container">
                    <input 
                        type="number" 
                        className="input-field" 
                        placeholder="Quantity"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setQuantity(e.target.value)}
                    />
                    <label className="field-label">Quantity</label>
                </div>

                <button className="submit-button" type="submit">Submit</button>
            </form>
        </Wrapper>
    )
}