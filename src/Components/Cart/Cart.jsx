import React from 'react';
import {Container, Typography, Button, Grid} from '@material-ui/core';
import useStyles from './styles';
import CartItem from './CartItem/CartItem';
import { Link } from 'react-router-dom';

const Cart = ({ cart,handleUpdateCartQuantity, handleRemoveFromCart, handleEmptycart }) => {
    const classes = useStyles();

    const isEmpty= !cart.total_items;
    // const isEmpty= false;
    const EmptyCart = ()=>(
        <Typography variant="subtitle1" >You don't have any item in your cart,
            <Link to='/'className={classes.link}>start adding some!</Link>

        </Typography>
    );

    const FilledCart=()=>(
        <>
            <Grid container spacing={3} >
                {cart.line_items.map((item)=>(
                    <Grid item xs={12} sm={4} key={item.id}>
                        <CartItem 
                            item={item} 
                            onUpdateCartQuantity={handleUpdateCartQuantity}
                            onRemoveFromCart={handleRemoveFromCart}/>
                    </Grid>
                ))}
            </Grid>
            <div className={classes.cardDetails} >
                <Typography variant="h4" >
                    Subtotal: {cart.subtotal.formatted_with_symbol}
                </Typography>
                <div>
                    <Button className={classes.emptyButton} size="large" type="button" variant="contained" color="secondary" onClick={handleEmptycart}>Empty Cart</Button>
                    <Button component={Link} to="/checkout" className={classes.checkoutButton} size="large" type="button" variant="contained" color="primary" >Check Out</Button>
                </div>
            </div>
        </>
    );
    // if(isEmpty) return "Loading..."

    return (
        <Container>
            <div className={classes.toolbar} />
            <Typography className={classes.title} variant="h3" gutterBottom >Your Shopping Cart</Typography>
            {isEmpty ? <EmptyCart/> : <FilledCart/>}
        </Container>
    )
}

export default Cart
