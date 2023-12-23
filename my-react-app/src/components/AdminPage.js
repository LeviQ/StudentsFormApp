import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminPage.css';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';


function Admin() {
  const navigate = useNavigate();
  const [semester, setSemester] = useState('');
  const [groupName, setgroupName] = useState('');
  const [offerings, setOfferings] = useState([]);
  const [allChartData, setAllChartData] = useState([]);
  

  const handleSemesterChange = (e) => setSemester(e.target.value);
  const handleGroupChange = (e) => setgroupName(e.target.value);

  const fetchSurveyChartDataForAllOfferings = async () => {
    try {
      const offeringsResponse = await axios.get(`http://localhost:5007/api/Offerings/GetOfferings`, {
        params: { semester, groupName }
      });

      // Przechowuj dane wykresów dla wszystkich offerings
      const allChartData = [];
  
      // Dla każdego offeringu pobierz dane wykresu
      for (const offering of offeringsResponse.data) {
        const chartDataResponse = await axios.get(`http://localhost:5007/api/SurveyChartData/GetSurveyChartData`, {
          params: { offeringId: offering.OfferingID}
        });
        allChartData.push(chartDataResponse.data);
      }

      setAllChartData(allChartData);
  
    } catch (error) {
      console.error('Error fetching survey chart data for all offerings:', error);
    }
  };

  const handleHome = () => {
    navigate('/home');
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const createChartOptions = (title) => {
    return {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: title,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };
  };

  const countOccurrences = (arr) => {
    return arr.reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {});
  };

  return (
    <div className='Page-container-Admin'>
      <div className='Header-Admin'>
        Witaj w Panelu Administracyjnym Ankiet Studenckich
      <button onClick={handleHome} className="SurveyButton">
        Podgląd Ankiet
      </button>
      <button onClick={handleLogout} className="logoutButton">
        Wyloguj się
      </button>
      </div>
    <div className="surveys-container-Admin">
            Wyszukaj Wyniki Ankiet po Semestrze i Grupie Studenckiej!
            <input type="number" placeholder="Semestr" value={semester} onChange={handleSemesterChange} />
            <input type="" placeholder="Grupa" value={groupName} onChange={handleGroupChange} />
            <button onClick={fetchSurveyChartDataForAllOfferings}>Pobierz Wyniki Ankiet</button>
            {allChartData.map((chartData, index) => {
          
          const answer1Occurrences = countOccurrences(chartData.Answer1Data);
          
          const chartDataArray = Array.from({ length: 5 }, (_, i) => answer1Occurrences[i + 1] || 0);
          return (
            <div key={index}>
              <h2>{chartData.SubjectName} Prowadzone przez {chartData.InstructorTitle} {chartData.InstructorName} Rodzaj Zajęć: {chartData.ClassTypeName} </h2>
              <div>
              <Bar
                data={{
                  labels: ['1', '2', '3', '4', '5'],
                  datasets: [
                    {
                      label: 'Wyniki',
                      data: chartDataArray,
                      backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    },
                    //Dalsze Wykresy
                  ],
                }}
                options = {createChartOptions('Jak ogólnie oceniasz zajęcia w skali od 1 do 5?')}
              />
              </div>
            </div>
          );
        })}
    </div>
    </div>
  );
};

export default Admin;