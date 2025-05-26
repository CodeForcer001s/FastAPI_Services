import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import './Wrapper.css'

interface WrapperProps {
    children: ReactNode
}

export const Wrapper = ({ children }: WrapperProps) => {
    return (
        <>
            <header className="main-header">
                <a className="logo" href="#">Company name</a>
                <nav className="header-nav">
                    <div className="nav-item">
                        <a className="nav-link" href="#">Sign out</a>
                    </div>
                </nav>
            </header>

            <div className="layout-container">
                <div className="layout-row">
                    <nav className="sidebar">
                        <div className="sidebar-content">
                            <ul className="nav-list">
                                <li className="nav-item">
                                    <Link to="/" className="nav-link active">
                                        Products
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/orders" className="nav-link">
                                        Orders
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </nav>

                    <main className="main-content">
                        {children}
                    </main>
                </div>
            </div>
        </>
    )
}