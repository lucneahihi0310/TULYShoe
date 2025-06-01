import React from 'react'
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
// import './App.css'
import Home from './Components/Header'
import Header from './Components/Header'
import HomePage from './Components/HomePage'
import Footer from './Components/Footer'
import ProductDetail from './Components/ProductDetail'


function App() {

  return (
    <>
      <Header/>
      {/* <HomePage/> */}
      <ProductDetail/>
      <Footer/>
    </>
  )
}

export default App
