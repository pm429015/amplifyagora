import React from "react";
import {API, graphqlOperation} from 'aws-amplify'
import {getMarket} from '../graphql/queries'
import { Link } from 'react-router-dom'
import { Loading, Tabs, Icon } from "element-react"
import NewProduct from '../components/NewProduct'
import { formatProductDate  } from "../utils"

class MarketPage extends React.Component {
  state = {
    market: null,
    isLoading: true,
    isMarketOwner:false
  };

  componentDidMount() {
    this.handleGetMarket()
  }

  handleGetMarket = async () => {
    const input = {
      id: this.props.marketId
    }
    const result = await API.graphql(graphqlOperation(getMarket, input))
    console.log({result})
    this.setState({market: result.data.getMarket, isLoading: false}, ()=>{
      this.checkMarketOwner()
    })
  }

  checkMarketOwner = () => {
    const {user} =this.props
    const {market} =this.state

    if (user) {
      this.setState({isMarketOwner: user.username === market.owner})
    }
  }

  render() {
    const {market, isLoading, isMarketOwner} = this.state;

    return isLoading? (

      <Loading fullscreen={true}/>
    ):(
      <>
        <Link className="link" to="/">
          Back to list
        </Link>
        <span className="items-center pt-2">
          MarketName:{market.name}
        </span>

        <div className="items-center pt-2">
          <span style={{ color: "var(--lightSquidInk)", paddingBottom: "1em"  }}>
            <Icon name="date" className="icon" />
            {market.createdAt}
          </span>
        </div>

        {/* New Product */}
        <Tabs type="border-card" value={isMarketOwner ? "1" : "2"}>
          {isMarketOwner && (
            <Tabs.Pane
              label={
                <>
                  <Icon name="plus" className="icon" />
                  Add Product
                </>

              }
              name="1"
            >
              <NewProduct />
            </Tabs.Pane>
          )}

          {/* Products List */}
          <Tabs.Pane
            label={
              <>
                <Icon name="menu" className="icon" />
                Products ({market.products.items.length})
              </>
            }
            name="2"
          >
          </Tabs.Pane>

        </Tabs>
      </>
    )
  }
}
export default MarketPage;
