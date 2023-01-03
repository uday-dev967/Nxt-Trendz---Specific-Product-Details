/* eslint-disable react/no-unknown-property */
import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    productData: {},
    similarProductsData: [],
    quantity: 1,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getProductDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {newId} = this.state
    const {id} = params
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    let apiUrl = `https://apis.ccbp.in/products/${id}`
    if (newId !== undefined) {
      apiUrl = `https://apis.ccbp.in/products/${newId}`
    }
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = {
        id: data.id,
        imageUrl: data.image_url,
        title: data.title,
        availability: data.availability,
        brand: data.brand,
        description: data.description,
        price: data.price,
        rating: data.rating,
        totalReviews: data.total_reviews,
      }
      const updatedSimilarProducts = data.similar_products.map(each => ({
        id: each.id,
        imageUrl: each.image_url,
        title: each.title,
        availability: each.availability,
        brand: each.brand,
        description: each.description,
        price: each.price,
        rating: each.rating,
      }))
      this.setState({
        productData: updatedData,
        similarProductsData: updatedSimilarProducts,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 404) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onDec = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  onInc = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  onSucessfulFetchView = () => {
    const {productData, quantity, similarProductsData} = this.state
    const {
      imageUrl,
      title,
      brand,
      price,
      rating,
      totalReviews,
      description,
      availability,
    } = productData
    return (
      <>
        <div className="selected-product-item">
          <img
            src={imageUrl}
            alt="product"
            className="selected-product-image"
          />
          <div>
            <h1 className="title">{title}</h1>
            <p className="price">RS {price}/-</p>
            <div className="rating-review">
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
              <p className="reviews">{totalReviews} Reviews</p>
            </div>
            <p className="text">{description}</p>
            <div className="label-value">
              <p className="text-title">Available:</p>
              <p className="text">{availability}</p>
            </div>
            <div className="label-value">
              <p className="text-title">Brand:</p>
              <p className="text">{brand}</p>
            </div>
            <hr />
            <div className="counter-container">
              <button
                type="button"
                className="count-button"
                onClick={this.onDec}
                testid="minus"
              >
                <BsDashSquare className="button-icon" />
              </button>
              <p className="count">{quantity}</p>
              <button
                type="button"
                className="count-button"
                onClick={this.onInc}
                testid="plus"
              >
                <BsPlusSquare className="button-icon" />
              </button>
            </div>
            <button type="button" className="add-to-cart">
              ADD TO CART
            </button>
          </div>
        </div>
        <div className="similar-products-container">
          <h1 className="products-list-heading">Similar products</h1>
          <ul className="products-list">
            {similarProductsData.map(product => (
              <SimilarProductItem productData={product} key={product.id} />
            ))}
          </ul>
        </div>
      </>
    )
  }

  loadingView = () => (
    <>
      <div className="products-details-loader-container" testid="loader">
        <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
      </div>
    </>
  )

  failureView = () => (
    <div className="product-details-failure-view-container">
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        className="failure-view-image"
      />
      <h1 className="product-not-found-heading">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderViews = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.onSucessfulFetchView()
      case apiStatusConstants.inProgress:
        return this.loadingView()
      case apiStatusConstants.failure:
        return this.failureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderViews()}
      </>
    )
  }
}

export default ProductItemDetails
