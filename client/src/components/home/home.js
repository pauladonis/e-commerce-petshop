import React from 'react';
import { Link } from 'react-router-dom';
import './home.css';
import image from '../../resources/IMG_0784.jpg';

function Home() {
    return(
        <div className="home">
            <h2>Welcome to All Aquaristik online shop</h2>
            <img src={image} alt={image} height="300" width="600"></img>
            <h3>Marine Aquariums, Tropical Aquariums, Pond Supplies, Terrariums, Vivariums & More....</h3>
            <p>All Aquaristik is an online superstore, specialising in marine aquariums, tropical aquariums and fish tanks, as well as a wide range of aquarium supplies, ranging from lighting, pumps and filters.</p>
            <p>Some of our most popular aquarium products include the <Link className="link" to={"/products/1"}>Diversa Aquarium 112L</Link>, <Link className="link" to={"/products/4"}>Oase BioMaster 250 External Aquarium Filter</Link>. However, if you can’t find the product that you are looking for then simply get in touch with us and we’ll be happy to help.</p>
            <p>Although our prices are extremely competitive, we run regular online special offers, so you can regularly grab yourself a fantastic bargain. When you also add free delivery in the UK, with orders over £50, why would you shop anywhere else for your aquarium equipment needs?</p>
        </div>
    )
}

export default Home;