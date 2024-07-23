import React, { useState, useEffect } from 'react';
import './App.css';

const API_DOMAIN = process.env.REACT_APP_API_DOMAIN;

function App() {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'MARATHON', direction: 'ascending' });

    const fetchData = () => {
        const sortQuery = `${sortConfig.key}:${sortConfig.direction === 'ascending' ? 'asc' : 'desc'}`;
        const url = `${API_DOMAIN}/api/athletes/best-times?sortDistance=${sortQuery}`;

        fetch(url)
            .then((response) => response.json())
            .then((result) => {
                const parsedData = result.map(item => ({
                    id: item.id,
                    name: item.name,
                    avatar_url: item.avatar_url,
                    rank: item.rank,
                    ...item.best_times
                }));
                setData(parsedData);
            })
            .catch((error) => console.error('Error fetching data:', error));
    };

    useEffect(() => {
        fetchData();
    }, [sortConfig]);

    const formatTime = (seconds) => {
        if (!seconds) return '';

        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hrs > 0) {
            return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
            return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
    };

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const filteredData = data.filter((item) =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleError = (e, name) => {
        e.target.style.display = 'none';
        const parent = e.target.parentElement;
        parent.style.display = 'flex';
        parent.style.alignItems = 'center';
        parent.style.justifyContent = 'center';
        const initial = document.createElement('div');
        initial.className = 'default-avatar';
        initial.textContent = name.charAt(0);
        parent.appendChild(initial);
    };

    return (
        <div className="leaderboard">
            <input
                type="text"
                id="search"
                placeholder="Search athlete"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="refresh" onClick={() => fetchData()}>LÀM MỚI</button>
            <div className="table-wrapper">
                <table>
                    <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th onClick={() => handleSort('FOUR_HUNDRED_M')}>400m</th>
                        <th onClick={() => handleSort('ONE_HALF_MILE')} hidden={true}>Half-mile</th>
                        <th onClick={() => handleSort('ONE_K')}>1000m</th>
                        <th onClick={() => handleSort('ONE_MILE')} hidden={true}>One-mile</th>
                        <th onClick={() => handleSort('TWO_MILE')} hidden={true}>Two-mile</th>
                        <th onClick={() => handleSort('FIVE_K')}>5K</th>
                        <th onClick={() => handleSort('TEN_K')}>10K</th>
                        <th onClick={() => handleSort('FIFTEEN_K')} hidden={true}>15K</th>
                        <th onClick={() => handleSort('TEN_MILE')} hidden={true}>10-mile</th>
                        <th onClick={() => handleSort('TWENTY_K')} hidden={true}>20K</th>
                        <th onClick={() => handleSort('HALF_MARATHON')}>Half-Marathon</th>
                        <th onClick={() => handleSort('MARATHON')}>Marathon</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredData.map((item) => (
                        <tr key={item.id}>
                            <td>{item.rank}</td>
                            <td className="name-column">
                                <div className="avatar-wrapper">
                                    <img className="avatar" src={item.avatar_url} alt="Avatar" onError={(e) => handleError(e, item.name)} />
                                </div>
                                <span>{item.name}</span>
                            </td>
                            <td>{formatTime(Number(item.FOUR_HUNDRED_M))}</td>
                            <td hidden={true}>{formatTime(Number(item.ONE_HALF_MILE))}</td>
                            <td>{formatTime(Number(item.ONE_K))}</td>
                            <td hidden={true}>{formatTime(Number(item.ONE_MILE))}</td>
                            <td hidden={true}>{formatTime(Number(item.TWO_MILE))}</td>
                            <td>{formatTime(Number(item.FIVE_K))}</td>
                            <td>{formatTime(Number(item.TEN_K))}</td>
                            <td hidden={true}>{formatTime(Number(item.FIFTEEN_K))}</td>
                            <td hidden={true}>{formatTime(Number(item.TEN_MILE))}</td>
                            <td hidden={true}>{formatTime(Number(item.TWENTY_K))}</td>
                            <td>{formatTime(Number(item.HALF_MARATHON))}</td>
                            <td>{formatTime(Number(item.MARATHON))}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default App;
