'use client'
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import ProductCard from './ProductCard'
import Title from './Title'
const LatestProducts = () => {
    const displayQuantity = 4
    const products = useSelector((state: RootState) => state.product.list)
    console.log(products)
    console.log('Products in LatestProducts:'
    );
    return (
        <div className='px-6 my-30 max-w-6xl mx-auto'>
            <Title title='Latest Products' description={`Showing ${products.length < displayQuantity ? products.length : displayQuantity} of ${products.length} products`} href='/shop' />
            <div className='mt-12 grid grid-cols-2 sm:flex flex-wrap gap-6 justify-between'>
                {products.slice().sort((a, b) => +(new Date(b.createdAt)) - +(new Date(a.createdAt))).slice(0, displayQuantity).map((product, index) => (
                    <ProductCard key={index} product={product} />
                ))}
            </div>
        </div>
    )
}

export default LatestProducts
