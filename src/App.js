import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import './App.css';

function App() {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'Marathon', direction: 'ascending' });

    useEffect(() => {
        fetch('/data.csv')
            .then((response) => response.text())
            .then((text) => {
                Papa.parse(text, {
                    header: true,
                    complete: (result) => {
                        setData(result.data);
                    },
                });
            })
            .catch((error) => console.error('Error fetching CSV data:', error));
    }, []);

    useEffect(() => {
        if (data.length > 0) {
            const sortedData = [...data].sort((a, b) => {
                const aValue = a["Half-Marathon"] ? Number(a["Half-Marathon"]) : Infinity;
                const bValue = b["Half-Marathon"] ? Number(b["Half-Marathon"]) : Infinity;
                return aValue - bValue;
            });

            sortedData.forEach((item, index) => {
                item.rank = item["Half-Marathon"] ? index + 1 : '-';
            });

            setData(sortedData);
        }
    }, [data]);

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

        setData((prevData) => {
            return [...prevData].sort((a, b) => {
                const aValue = Number(a[key]);
                const bValue = Number(b[key]);

                if (!a[key] && b[key]) return 1;
                if (a[key] && !b[key]) return -1;
                if (!a[key] && !b[key]) return 0;

                if (direction === 'ascending') {
                    return aValue - bValue;
                } else {
                    return bValue - aValue;
                }
            });
        });
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
            <button className="refresh" onClick={() => window.location.reload()}>LÀM MỚI</button>
            <div className="table-wrapper">
                <table>
                    <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th onClick={() => handleSort('m400')}>400m</th>
                        <th onClick={() => handleSort('h-mile')} hidden={true}>Half-mile</th>
                        <th onClick={() => handleSort('1k')}>1000m</th>
                        <th onClick={() => handleSort('one-mile')} hidden={true}>One-mile</th>
                        <th onClick={() => handleSort('two-mile')} hidden={true}>Two-mile</th>
                        <th onClick={() => handleSort('5K')}>5K</th>
                        <th onClick={() => handleSort('10K')}>10K</th>
                        <th onClick={() => handleSort('15K')} hidden={true}>15K</th>
                        <th onClick={() => handleSort('10mile')} hidden={true}>10-mile</th>
                        <th onClick={() => handleSort('20K')} hidden={true}>20K</th>
                        <th onClick={() => handleSort('Half-Marathon')}>Half-Marathon</th>
                        <th onClick={() => handleSort('Marathon')}>Marathon</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredData.map((item) => (
                        <tr key={item.athlete_id}>
                            <td>{item.rank}</td>
                            <td className="name-column">
                                <div className="avatar-wrapper">
                                    <img className="avatar" src={item.avatar_src} alt="Avatar" onError={(e) => handleError(e, item.name)} />
                                </div>
                                <span>{item.name}</span>
                            </td>
                            <td>{formatTime(Number(item.m400))}</td>
                            <td hidden={true}>{formatTime(Number(item["h-mile"]))}</td>
                            <td>{formatTime(Number(item["1k"]))}</td>
                            <td hidden={true}>{formatTime(Number(item["one-mile"]))}</td>
                            <td hidden={true}>{formatTime(Number(item["two-mile"]))}</td>
                            <td>{formatTime(Number(item["5K"]))}</td>
                            <td>{formatTime(Number(item["10K"]))}</td>
                            <td hidden={true}>{formatTime(Number(item["15K"]))}</td>
                            <td hidden={true}>{formatTime(Number(item["10mile"]))}</td>
                            <td hidden={true}>{formatTime(Number(item["20K"]))}</td>
                            <td>{formatTime(Number(item["Half-Marathon"]))}</td>
                            <td>{formatTime(Number(item["Marathon"]))}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default App;
