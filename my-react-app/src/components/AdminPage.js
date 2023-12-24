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
    

      <div className='MiddleContainer'>
      <div className="title-container">
        Wyszukaj Wyniki Ankiet po Semestrze i Grupie Studenckiej!
      </div>
      <div className="inputs-container">
        <input type="number" placeholder="Semestr" value={semester} onChange={handleSemesterChange} />
        <input type="" placeholder="Grupa Studencka" value={groupName} onChange={handleGroupChange} />
      </div>
      <div className="button-container">
        <button onClick={fetchSurveyChartDataForAllOfferings}>Pobierz Wyniki Ankiet</button>
      </div>
      </div>

      <div className="surveys-container-Admin">
      {allChartData.map((chartData, index) => {
          
          const answer1Occurrences = countOccurrences(chartData.Answer1Data);
          const answer2Occurrences = countOccurrences(chartData.Answer2Data);
          const answer3Occurrences = countOccurrences(chartData.Answer3Data);
          const answer4Occurrences = countOccurrences(chartData.Answer4Data);
          const answer5Occurrences = countOccurrences(chartData.Answer5Data);
          const answer6Occurrences = countOccurrences(chartData.Answer6Data);
          const answer7Occurrences = countOccurrences(chartData.Answer7Data);
        
          const chartDataArray1 = Array.from({ length: 5 }, (_, i) => answer1Occurrences[i + 1] || 0);
          const chartDataArray2 = Array.from({ length: 5 }, (_, i) => answer2Occurrences[i + 1] || 0);
          const chartDataArray3 = Array.from({ length: 5 }, (_, i) => answer3Occurrences[i + 1] || 0);
          const chartDataArray4 = Array.from({ length: 5 }, (_, i) => answer4Occurrences[i + 1] || 0);
          const chartDataArray5 = Array.from({ length: 5 }, (_, i) => answer5Occurrences[i + 1] || 0);
          const chartDataArray6 = Array.from({ length: 5 }, (_, i) => answer6Occurrences[i + 1] || 0);
          const chartDataArray7 = Array.from({ length: 5 }, (_, i) => answer7Occurrences[i + 1] || 0);

          return (
            <div key={index}>
              <h2>{chartData.SubjectName} prowadzone/a przez {chartData.InstructorTitle} {chartData.InstructorName} Rodzaj Zajęć: {chartData.ClassTypeName} </h2>
              <div style={{ width: '98%', height: '100%'}} >
              <Bar
                data={{
                  labels: ['1', '2', '3', '4', '5'],
                  datasets: [
                    {
                      label: 'Wyniki',
                      data: chartDataArray1,
                      backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    },
                  ],
                }}
                options = {createChartOptions('Pytanie 1: Jak ogólnie oceniasz zajęcia w skali od 1 do 5?')}
              />
              <Bar
                data={{
                  labels: ['1', '2', '3', '4', '5'],
                  datasets: [
                    {
                      label: 'Wyniki',
                      data: chartDataArray2,
                      backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    },
                  ],
                }}
                options = {createChartOptions('Stwierdzenie 1. Na pierwszych zajęciach osoba prowadząca określiła, zgodnie z sylabusem, założenia i zasady zaliczania przedmiotu.')}
              />
              <Bar
                data={{
                  labels: ['1', '2', '3', '4', '5'],
                  datasets: [
                    {
                      label: 'Wyniki',
                      data: chartDataArray3,
                      backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    },
                  ],
                }}
                options = {createChartOptions('Stwierdzenie 2. Uzyskano od osoby prowadzącej odpowiedzi na pytania zadawane w czasie zajęć i/lub konsultacji.')}
              />
               <Bar
                data={{
                  labels: ['1', '2', '3', '4', '5'],
                  datasets: [
                    {
                      label: 'Wyniki',
                      data: chartDataArray4,
                      backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    },
                  ],
                }}
                options = {createChartOptions('Stwierdzenie 3. Osoby studiujące były traktowane przez osobę prowadzącą z szacunkiem i zgodnie z zasadą równego traktowania.')}
              />
              <Bar
                data={{
                  labels: ['1', '2', '3', '4', '5'],
                  datasets: [
                    {
                      label: 'Wyniki',
                      data: chartDataArray5,
                      backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    },
                  ],
                }}
                options = {createChartOptions('Stwierdzenie 4. Określone w sylabusie zasady zaliczenia przedmiotu były przestrzegane.')}
              />
              <Bar
                data={{
                  labels: ['1', '2', '3', '4', '5'],
                  datasets: [
                    {
                      label: 'Wyniki',
                      data: chartDataArray6,
                      backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    },
                  ],
                }}
                options = {createChartOptions('Stwierdzenie 5. Prezentowany przez osobę prowadzącą materiał rozwinął moją wiedzę i/lub umiejętności.')}
              />
              <Bar
                data={{
                  labels: ['1', '2', '3', '4', '5'],
                  datasets: [
                    {
                      label: 'Wyniki',
                      data: chartDataArray7,
                      backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    },
                  ],
                }}
                options = {createChartOptions('Stwierdzenie 6. Zajęcia oceniam jako interesujące.')}
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