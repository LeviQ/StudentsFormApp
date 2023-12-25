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
          color: '#2c3e50',
          display: true,
          text: title,
          font: {
            size: 20,
            weight: 900
          }
        },
        legend: {
          labels: {
            color: '#2c3e50', 
            font: {
              size: 18, 
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: 'black', 
            font: {
              size: 12, 
            },
          },
          title: {
            display: true,
            text: 'Ocena', 
            color: '#2c3e50', 
            font: {
              size: 18,
              weight: 'bold'  
            },
          },
        },
        y: {
          ticks: {
            color: 'black', 
            font: {
              size: 12, 
            },
          },
          title: {
            display: true,
            text: 'Ilość Studentów', 
            color: '#2c3e50', 
            font: {
              size: 15,
              weight: 'bold' 
            },
          },
        },
      },
      animation: {
        delay: (context) => {
          return context.dataIndex * 300 + context.datasetIndex * 100;
        }
      }
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

      <div className='Header-Admin' style={{
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", 
                fontWeight: '800', 
                color: '#2c3e50', 
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)', 
                fontWeight: 'bold'
                }}>
        Witaj w Panelu Administracyjnym Ankiet Studenckich
      <button onClick={handleHome} className="SurveyButton">
        Podgląd Ankiet
      </button>
      <button onClick={handleLogout} className="logoutButton">
        Wyloguj się
      </button>
      </div>
    
      <div className='MiddleContainer'>
      <div className="title-container" style={{
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", 
                fontSize: '24px', 
                fontWeight: '600', 
                color: '#2c3e50', 
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)', 
                textAlign: 'center', 
                fontWeight: 'bold'
                }}>
        Wyszukaj Wyniki Ankiet po Semestrze i Grupie Studenckiej!
      </div>
      <div className="inputs-container">
        <input type="number" placeholder="Semestr" value={semester} onChange={handleSemesterChange} style={{
                border: "3px solid #2c3e50",
                borderRadius: '5px',
                outline: 'none',
                fontSize: '20px',
                color: '#2c3e50',
                backgroundColor: '#ecf0f1',
                transition: 'border-color 0.3s'
                }}/>
        <input type="" placeholder="Grupa Studencka" value={groupName} onChange={handleGroupChange} style={{
                border: "3px solid #2c3e50",
                borderRadius: '5px',
                outline: 'none',
                fontSize: '20px',
                color: '#2c3e50',
                backgroundColor: '#ecf0f1',
                transition: 'border-color 0.3s'
                }}/>
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
              <h2 style={{
                marginBottom: '20px',
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", 
                fontSize: '24px', 
                fontWeight: '600', 
                color: '#2c3e50', 
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)', 
                textAlign: 'center', 
                }}>
                  Nazwa Przedmiotu: <strong>{chartData.SubjectName}</strong> <br /> Prowadzący: <strong>{chartData.InstructorTitle}</strong><strong>{chartData.InstructorName}</strong><br />
                  Rodzaj Zajęć: <strong>{chartData.ClassTypeName}</strong> </h2>
              <Bar style={{marginBottom:'35px'}}
                data={{
                  labels: ['1', '2', '3', '4', '5'],
                  datasets: [
                    {
                      label: 'Ocena Studentów',
                      data: chartDataArray1,
                      backgroundColor: 'rgba(53, 162, 235, 0.5)',
                      borderWidth: 2,
                      borderColor: 'black',
                    },
                  ],
                }}
                options = {createChartOptions('Jak ogólnie oceniasz zajęcia w skali od 1 do 5?')}
              />
              <Bar style={{marginBottom:'35px'}}
                data={{
                  labels: ['1', '2', '3', '4', '5'],
                  datasets: [
                    {
                      label: 'Ocena Studentów',
                      data: chartDataArray2,
                      backgroundColor: 'rgba(53, 162, 235, 0.5)',
                      borderWidth: 2,
                      borderColor: 'black',                    },
                  ],
                }}
                options = {createChartOptions('Na pierwszych zajęciach osoba prowadząca określiła, zgodnie z sylabusem, założenia i zasady zaliczania przedmiotu.')}
              />
              <Bar style={{marginBottom:'35px'}}
                data={{
                  labels: ['1', '2', '3', '4', '5'],
                  datasets: [
                    {
                      label: 'Ocena Studentów',
                      data: chartDataArray3,
                      backgroundColor: 'rgba(53, 162, 235, 0.5)',
                      borderWidth: 2,
                      borderColor: 'black',
                    },
                  ],
                }}
                options = {createChartOptions('Uzyskano od osoby prowadzącej odpowiedzi na pytania zadawane w czasie zajęć i/lub konsultacji.')}
              />
               <Bar style={{marginBottom:'35px'}}
                data={{
                  labels: ['1', '2', '3', '4', '5'],
                  datasets: [
                    {
                      label: 'Ocena Studentów',
                      data: chartDataArray4,
                      backgroundColor: 'rgba(53, 162, 235, 0.5)',
                      borderWidth: 2,
                      borderColor: 'black',
                    },
                  ],
                }}
                options = {createChartOptions('Osoby studiujące były traktowane przez osobę prowadzącą z szacunkiem i zgodnie z zasadą równego traktowania.')}
              />
              <Bar style={{marginBottom:'35px'}}
                data={{
                  labels: ['1', '2', '3', '4', '5'],
                  datasets: [
                    {
                      label: 'Ocena Studentów',
                      data: chartDataArray5,
                      backgroundColor: 'rgba(53, 162, 235, 0.5)',
                      borderWidth: 2,
                      borderColor: 'black',
                    },
                  ],
                }}
                options = {createChartOptions('Określone w sylabusie zasady zaliczenia przedmiotu były przestrzegane.')}
              />
              <Bar style={{marginBottom:'35px'}}
                data={{
                  labels: ['1', '2', '3', '4', '5'],
                  datasets: [
                    {
                      label: 'Ocena Studentów',
                      data: chartDataArray6,
                      backgroundColor: 'rgba(53, 162, 235, 0.5)',
                      borderWidth: 2,
                      borderColor: 'black',
                    },
                  ],
                }}
                options = {createChartOptions('Prezentowany przez osobę prowadzącą materiał rozwinął moją wiedzę i/lub umiejętności.')}
              />
              <Bar style={{marginBottom:'35px'}}
                data={{
                  labels: ['1', '2', '3', '4', '5'],
                  datasets: [
                    {
                      label: 'Ocena Studentów',
                      data: chartDataArray7,
                      backgroundColor: 'rgba(53, 162, 235, 0.5)',
                      borderWidth: 2,
                      borderColor: 'black',
                    },
                  ],
                }}
                options = {createChartOptions('Zajęcia oceniam jako interesujące.')}
              />
              </div>
          );
        })}
    </div>
  </div>
  );
};

export default Admin;