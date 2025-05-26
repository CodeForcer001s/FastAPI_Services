import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import './Orders.css'

export const Orders = () => {
    const [id, setId] = useState<string>('')
    const [quantity, setQuantity] = useState<string>('')
    const [message, setMessage] = useState<string>('Buy your favorite product')

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                if (id) {
                    const response = await fetch(`http://localhost:8000/products/${id}`)
                    const content = await response.json()
                    const price = parseFloat(content.price) * 1.2
                    setMessage(`Your product price is $${price}`)
                }
            } catch (e) {
                setMessage('Buy your favorite product')
            }
        }

        fetchProduct()
    }, [id])

    const submit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        if (!id || !quantity) {
            setMessage('Please fill in all fields')
            return
        }

        const quantityNum = parseInt(quantity)
        
        if (isNaN(quantityNum) || quantityNum <= 0) {
            setMessage('Please enter a valid quantity')
            return
        }
        
        try {
            const orderData = {
                id: id,  // Keep ID as string, don't parse it
                quantity: quantityNum
            }
            
            console.log('Sending order data:', orderData)
            
            const response = await fetch('http://localhost:8001/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            })
        
            if (!response.ok) {
                throw new Error('Failed to place order. Please try again.')
            }
        
            setMessage('Thank you for your order!')
            setId('')
            setQuantity('')
        } catch (error) {
            setMessage(`Error: ${error instanceof Error ? error.message : 'Failed to place order'}`)
        }
    }

    return (
        <div className="orders-container">
            <main className="orders-main">
                <div className="orders-header">
                    <h2>Checkout form</h2>
                    <p className="message">{message}</p>
                </div>

                <form className="orders-form" onSubmit={submit}>
                    <div className="form-row">
                        <div className="input-group">
                            <label>Product</label>
                            <input 
                                className="input-field"
                                value={id}
                                onChange={e => setId(e.target.value)}
                            />
                        </div>

                        <div className="input-group">
                            <label>Quantity</label>
                            <input 
                                type="number" 
                                className="input-field"
                                onChange={e => setQuantity(e.target.value)}
                            />
                        </div>
                    </div>
                    <hr className="divider" />
                    <button className="submit-button" type="submit">Buy</button>
                </form>
            </main>
        </div>
    )
}