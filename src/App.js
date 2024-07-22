import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import './App.css';

function App() {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState(null);

    useEffect(() => {
        fetch('/voz.csv')
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
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th onClick={() => handleSort('m400')}>400m</th>
                    <th onClick={() => handleSort('h-mile')}>Half-mile</th>
                    <th onClick={() => handleSort('1k')}>1K</th>
                    <th onClick={() => handleSort('one-mile')}>One-mile</th>
                    <th onClick={() => handleSort('two-mile')}>Two-mile</th>
                    <th onClick={() => handleSort('5K')}>5K</th>
                    <th onClick={() => handleSort('10K')}>10K</th>
                    <th onClick={() => handleSort('15K')}>15K</th>
                    <th onClick={() => handleSort('10mile')}>10-mile</th>
                    <th onClick={() => handleSort('20K')}>20K</th>
                    <th onClick={() => handleSort('Half-Marathon')}>Half-Marathon</th>
                    <th onClick={() => handleSort('Marathon')}>Marathon</th>
                </tr>
                </thead>
                <tbody>
                {filteredData.map((item) => (
                    <tr key={item.athlete_id}>
                        <td>
                            <img className="avatar" src={item.avatar_src} alt="Avatar" />
                            {item.name}
                        </td>
                        <td>{formatTime(Number(item.m400))}</td>
                        <td>{formatTime(Number(item["h-mile"]))}</td>
                        <td>{formatTime(Number(item["1k"]))}</td>
                        <td>{formatTime(Number(item["one-mile"]))}</td>
                        <td>{formatTime(Number(item["two-mile"]))}</td>
                        <td>{formatTime(Number(item["5K"]))}</td>
                        <td>{formatTime(Number(item["10K"]))}</td>
                        <td>{formatTime(Number(item["15K"]))}</td>
                        <td>{formatTime(Number(item["10mile"]))}</td>
                        <td>{formatTime(Number(item["20K"]))}</td>
                        <td>{formatTime(Number(item["Half-Marathon"]))}</td>
                        <td>{formatTime(Number(item["Marathon"]))}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;
