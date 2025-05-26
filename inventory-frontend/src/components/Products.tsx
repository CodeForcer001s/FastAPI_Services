import { Wrapper } from "./Wrapper"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import './Products.css'

interface Product {
    id: number
    name: string
    price: number
    quantity: number
}

export const Products = () => {
    const [products, setProducts] = useState<Product[]>([])

    useEffect(() => {
        const fetchProducts = async () => {
            const response = await fetch('http://localhost:8000/products')
            const content = await response.json()
            setProducts(content)
        }

        fetchProducts()
    }, [])

    const del = async (id: number) => {
        if (window.confirm('Are you sure to delete this record?')) {
            await fetch(`http://localhost:8000/products/${id}`, {
                method: 'DELETE'
            })

            setProducts(products.filter(p => p.id !== id))
        }
    }

    return (
        <Wrapper>
            <div className="header-actions">
                <Link to="/create" className="add-button">Add</Link>
            </div>

            <div className="table-container">
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td>{product.id}</td>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.quantity}</td>
                                <td>
                                    <button 
                                        className="delete-button"
                                        onClick={() => del(product.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Wrapper>
    )
}