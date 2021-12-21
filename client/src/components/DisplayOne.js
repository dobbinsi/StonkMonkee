import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, navigate } from "@reach/router";
import nanalogo from "../images/nanalogo.JPG";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from 'chart.js/auto'


const DisplayOne = (props) => {
    const { id } = props;
    const [stonk, setStonk] = useState({});
    const [imageData, setImageData] = useState({});
    const [priceData, setPriceData] = useState({});
    const [capData, setCapData] = useState({});
    const [chartData, setChartData] = useState([]);
    const [sevenData, setSevenData] = useState([]);
    const [thirtyData, setThirtyData] = useState([]);
    const [sixtyData, setSixtyData] = useState([]);
    const [twoHundredData, setTwoHundredData] = useState([]);
    const [oneYearData, setOneYearData] = useState([]);
    const [userId, setUserId] = useState("");

    useEffect(() => {
        axios.get(`https://api.coingecko.com/api/v3/coins/${id}`)
            .then((res) => {
                console.log(res);
                console.log(res.data);
                setStonk(res.data);
                setImageData(res.data.image.small);
                setPriceData(res.data.market_data.current_price);
                setCapData(res.data.market_data.market_cap);
                setSevenData(res.data.market_data.price_change_percentage_7d);
                setThirtyData(res.data.market_data.price_change_percentage_30d);
                setSixtyData(res.data.market_data.price_change_percentage_60d);
                setTwoHundredData(res.data.market_data.price_change_percentage_200d);
                setOneYearData(res.data.market_data.price_change_percentage_1y);
            })
            .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        axios.get(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=365&interval=daily`)
            .then((res) => {
                console.log(res);
                console.log(res.data.prices);
                console.log(res.data.prices[0]);
                setChartData(res.data.prices);
            })
            .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        setUserId(localStorage.getItem("userId", userId));
        console.log(localStorage.getItem("userId"));
    }, []);

    const logout = (e) => {
        e.preventDefault();
        axios.post("http://localhost:8000/api/users/logout",
            {},
            {
                withCredentials: true,
            },
        )
            .then((res) => {
                console.log(res.data);
                localStorage.removeItem("userId");
                navigate("/");
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div>
            <div className="header-main">
                <div className="brand-logo">
                    <img src={nanalogo} className="nana-logo" />
                    <h1>StonkMonkee</h1>
                </div>
                <div>
                    <div className="navbar">
                        <Link to={"/stonks/home"} className="nav-links">All Stonks</Link>
                        <Link to={"/stonks/new"} className="nav-links">Add Stonks</Link>
                        <Link to={`/users/portfolio/${userId}`} className="nav-links">My Portfolio</Link>
                        <Link to={"/"} className="nav-links" onClick={logout} >Log Out</Link>
                        <select>
                            <option value={"/"}>Navigation</option>
                            <option value={"/stonks/home"}>All Stonks</option>
                            <option value={"/stonks/new"}>Add Stonks</option>
                            <option value={`/users/portfolio/${userId}`}>My Portfolio</option>
                            <option value={"/"} onClick={logout}>Log Out</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="body-main">
                <div className="name-ticker">
                    <img src={imageData} alt="coin" className="img-details" />
                    <h1>{stonk.name}</h1>
                    <h2 className="coin-ticker">({stonk.symbol})</h2>
                </div>
                <h2 className="big-price">${priceData.usd}</h2>
                <p className="big-mktcap">Market Cap: ${capData.usd}</p>
                <div className="chart-area">
                    <Line
                        data={{
                            labels: chartData.map((coin) => {
                                let date = new Date(coin[0]);
                                return date.toLocaleDateString();
                            }),
                            datasets: [
                                {
                                    data: chartData.map((coin) => coin[1]),
                                    label: "Price (USD)",
                                    borderColor: "gold",
                                },
                            ],
                        }}
                        options={{
                            elements: {
                                point: {
                                    radius: 2,
                                },
                            },
                        }}
                    />
                </div>
                <div className="price-change">
                    <table className="price-table">
                        <tr>
                            <th>7d</th>
                            <th>30d</th>
                            <th>60d</th>
                            <th>200d</th>
                            <th>1y</th>
                        </tr>
                        <tr>
                            {
                                sevenData < 0 ?
                                    <td className="red-numbers">{sevenData} %</td>
                                    : <td>{sevenData} %</td>
                            }
                            {
                                thirtyData < 0 ?
                                    <td className="red-numbers">{thirtyData} %</td>
                                    : <td>{thirtyData} %</td>
                            }
                            {
                                sixtyData < 0 ?
                                    <td className="red-numbers">{sixtyData} %</td>
                                    : <td>{sixtyData} %</td>
                            }
                            {
                                twoHundredData < 0 ?
                                    <td className="red-numbers">{twoHundredData} %</td>
                                    : <td>{twoHundredData} %</td>
                            }
                            {
                                oneYearData < 0 ?
                                    <td className="red-numbers">{oneYearData} %</td>
                                    : <td>{oneYearData} %</td>
                            }
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default DisplayOne;