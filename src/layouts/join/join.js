import React, { Component } from 'react';
import PropTypes from 'prop-types'
import '../../App.css'
import { Link } from 'react-router-dom'
import BBButton from '../component/BBButton';
import Countdown  from './Countdown.js';
import Web3 from 'web3';
import BBOHoldingContract from '../../../build/contracts/BBOHoldingContract.json'
import CurrencyFormat from 'react-currency-format';

class Join extends Component {

    constructor(props, context) {
        super(props);
        this.classes  = props;
        this.linkPostMyEtherWallet = 'https://github.com/bigbomio/hodl/blob/master/src/layouts/introduce/content.md#using-myetherwallet';

        this.state = {
            currentAvailableReward: 0,
            depositStopTime: 0,
            depositStartTime: 0
        };
        this.web3Local = new Web3("https://ropsten.infura.io/e7cf61fe75a64b2f91459362e0e5beb8");
        this.BBOHoldingInstance = new this.web3Local.eth.Contract(BBOHoldingContract.abi, '0xdc93c6c43dad3280737be00dec8f301a2cbfd25c');
        this.getDepositime();
    }
    getDepositime(){
        let that = this;
        that.BBOHoldingInstance.methods.depositStartTime().call().then(function(depositStartTime){
            if(that.state.depositStartTime!=depositStartTime){
                that.setState({depositStartTime:depositStartTime})
            }
        })
        that.BBOHoldingInstance.methods.depositStopTime().call().then(function(depositStopTime){
            if(that.state.depositStopTime!=depositStopTime){
                that.setState({depositStopTime:depositStopTime})
            }
        })
    }
    getCurrentReward(){
        let that=this;
        that.BBOHoldingInstance.methods.bboDeposited().call().then(function(deposited){
            deposited = that.web3Local.utils.fromWei(deposited, 'ether')
            that.BBOHoldingInstance.methods.bboBalance().call().then(function(balance){
                balance = that.web3Local.utils.fromWei(balance, 'ether')
                let reward = balance - deposited;

                if(that.state.currentAvailableReward != reward){
                    that.setState({currentAvailableReward: reward});
                }
            })
        })
    }
    displayDateUTC(time){
        return new Date(time*1000).toUTCString();
    }
    render() {
        this.getCurrentReward();
        return (
            <main className="container">
             <div className="pure-g">
             <div className="pure-u-1-1 header">
             <h1 className = "newstype">Midas Foundation Long-term HODLING program <br/> for BBO Hodlers</h1>
            <h2>Program Stage: <strong className="text-green">Deposit</strong></h2>
            <h2>Current Available Rewards:<strong className="text-green"> <CurrencyFormat displayType='text' decimalScale='2' value={this.state.currentAvailableReward} thousandSeparator={true} prefix={''} /> BBO</strong></h2>
            <div> <strong>Deposit</strong> is ending in ({this.displayDateUTC(this.state.depositStopTime)}):   <span>
                <Countdown date={this.state.depositStopTime*1000} />
               </span>
            </div>
            
            <h3 className="newstype">JOIN WITH</h3>
            <div className = 'list-btn'>
        
            <Link to="/metamask">
            <BBButton content="Connect Metamask" className = 'button-text metamask' variant="green" />
            </Link>
            <span className="or-text">OR</span>
            <BBButton content="Using MyEtherWallet" variant="green" className = 'button-text mew'  
                onClick={ ()=> {let newWindow = window && window.open(this.linkPostMyEtherWallet);}}/>
        
    
        </div>
            </div>
            </div>
            </main>

        );
    }

};
Join.contextTypes = {
    drizzle: PropTypes.object
  }

export default Join
