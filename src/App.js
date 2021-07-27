import React, { useState, useEffect } from 'react'
import { commerce } from './lib/commerce'
import { Products, Navbar, Cart, Checkout } from './Components';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

const App = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({});
    const [order, setOrder] = useState({});
    const [errorMessage, setErrorMessage] = useState('')


    const fetchProducts = async ()=>{
        const { data } = await commerce.products.list();
        setProducts(data);
    }
    const fetchCart = async ()=>{
        const cart  = await commerce.cart.retrieve();
        setCart(cart)
    }

    const handleAddToCart= async (productId, quantity)=>{
        const {cart}  = await commerce.cart.add(productId, quantity);
        setCart(cart);
    }

    const handleUpdateCartQuantity = async (productId, quantity)=>{
        const {cart} = await commerce.cart.update(productId, {quantity});
        setCart(cart)
    }

    const handleRemoveFromCart = async (productId)=>{
        const {cart} = await commerce.cart.remove(productId);
        setCart(cart);
    }

    const handleEmptycart = async () =>{
        const {cart} = await commerce.cart.empty();
        setCart(cart);
    }

    const RefreshCart = async ()=>{
        const newcart = await commerce.cart.refresh();
        setCart(newcart);
    }

    const handleCaptureCheckout = async (checkoutTokenId, newOrder)=>{
        try {
            const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder);
            setOrder(incomingOrder);
            RefreshCart();
        } catch (error) {
         setErrorMessage(error.data.error.message);   
        }
    }
    
    useEffect(() => {
        fetchProducts();
        fetchCart();
       
    }, []);
    console.log(cart.total_items);
    return (
        <Router>
        <div>
            <Navbar totalItems = {cart.total_items}/>
            <Switch>
                <Route exact path="/">
                    <Products products={products} onAddToCart={handleAddToCart} />
                </Route>
                <Route path="/cart">
                    <Cart 
                        cart={cart}
                        handleUpdateCartQuantity = {handleUpdateCartQuantity}
                        handleRemoveFromCart = {handleRemoveFromCart}
                        handleEmptycart = {handleEmptycart}
                    /> 
                </Route>
                <Route path="/checkout">
                    <Checkout cart={cart} handleCaptureCheckout={handleCaptureCheckout} order={order} error={errorMessage} />
                </Route>
            </Switch>
            
        </div>
        </Router>
        
    )
}

export default App
