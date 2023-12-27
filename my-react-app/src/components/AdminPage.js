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
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filter, setFilter] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loginSuccess, setloginSuccess] = useState(false);
  const [error, setError] = useState('');

  const fetchSurveyChartDataForAllOfferings = async () => {

    setError('');  
    const allowedGroupsForLowerSemesters = ['1', '2', '3', '4', '5', '6', '7'];
    const allowedGroupsForHigherSemesters = ['ISI-1', 'ISI-2', 'SIAG', 'TM', 'ISK'];

    if (semester <= 4 && !allowedGroupsForLowerSemesters.includes(groupName)) {
      setError('Wybrano niepoprawną grupę studencką dla semestru 1-4.');
    } else if (semester > 4 && !allowedGroupsForHigherSemesters.includes(groupName)) {
      setError('Wybrano niepoprawną grupę studencką dla semestru 5-7.');
    } else {
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
    console.log('Pobieranie wyników ankiety...');
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

  const toggleFilterVisibility = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  const handleSearch = () => {
    if (filter) {
      const filtered = allChartData.filter(chartData => 
        chartData.SubjectName.toLowerCase().includes(filter.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(allChartData);
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const clearFilter = () => {
    setFilter('');
    setFilteredData(allChartData);
  };

  const hideFilter = () => {
    setIsFilterVisible(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    document.querySelector('.Header-Admin').classList.add('modal-blur');
    document.querySelector('.MiddleContainer').classList.add('modal-blur');
    document.querySelector('.surveys-container-Admin').classList.add('modal-blur');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    document.querySelector('.Header-Admin').classList.remove('modal-blur');
    document.querySelector('.MiddleContainer').classList.remove('modal-blur');
    document.querySelector('.surveys-container-Admin').classList.remove('modal-blur');
  };

  const handleInstructorsExport = async () => {
    const response = await fetch('http://localhost:5007/api/ExportData/export-instructors');
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'Instructors.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubjectsExport = async () => {
    const response = await fetch('http://localhost:5007/api/ExportData/export-subjects');
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'Subjects.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOfferingsExport = async () => {
    const response = await fetch('http://localhost:5007/api/ExportData/export-offerings');
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'Offerings.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleStudentsGroupsExport = async () => {
    const response = await fetch('http://localhost:5007/api/ExportData/export-studentgroups');
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'StudentGroups.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClassTypesExport = async () => {
    const response = await fetch('http://localhost:5007/api/ExportData/export-classtypes');
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'ClassTypes.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  
  const handleInstructorImport = async () => {
    const instructorImportData = new FormData();
    instructorImportData.append('file', selectedFile);
    try {
      const response = await fetch('http://localhost:5007/api/ImportData/import-instructors', {
        method: 'POST',
        body: instructorImportData
      });
  
      if (response.ok) {
        setloginSuccess(true);
        setTimeout(() => {
          setloginSuccess(false);
      }, 2500); 
        console.log('Zaktualizowano Listę Prowadzących');
      } else {
        console.error('Nie udało się zaktualizować Listy Prowadzących');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubjectImport = async () => {
    const subjectImportData = new FormData();
    subjectImportData.append('file', selectedFile);
    try {
      const response = await fetch('http://localhost:5007/api/ImportData/import-subjects', {
        method: 'POST',
        body: subjectImportData
      });
  
      if (response.ok) {
        setloginSuccess(true);
        setTimeout(() => {
          setloginSuccess(false);
      }, 2500); 
        console.log('Zaktualizowano Listę Przedmiotów');
      } else {
        console.error('Nie udało się zaktualizować Listy Przedmiotów');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleOfferingImport = async () => {
    const offeringImportData = new FormData();
    offeringImportData.append('file', selectedFile);
    try {
      const response = await fetch('http://localhost:5007/api/ImportData/import-courseofferings', {
        method: 'POST',
        body: offeringImportData
      });
  
      if (response.ok) {
        setloginSuccess(true);
        setTimeout(() => {
          setloginSuccess(false);
      }, 2500); 
        console.log('Pomyślnie zaktualizowano Listę!');
      } else {
        console.error('Nie udało się zaktualizować Listy');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className='Page-container-Admin'>
      {loginSuccess && 
            <div className={`success-message ${loginSuccess ? 'active' : ''}`}>
                Zaktualizowano Pomyślnie!
            </div>}
      <div className='Header-Admin' style={{
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", 
                fontWeight: '800', 
                color: '#2c3e50', 
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)', 
                fontWeight: 'bold'
                }}>
        <div style={{ flex: 1, textAlign: 'left' }}> 
          Witaj w Panelu Administracyjnym Ankiet Studenckich
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={handleOpenModal} className='UniversityButton'>
            Aktualizuj Plan
          </button>
          <button onClick={handleHome} className="SurveyButton">
            Podgląd Ankiet
          </button>
          <button onClick={handleLogout} className="logoutButton">
            Wyloguj się
          </button>
        </div>
        </div>

      {isModalOpen && (
        <div className="modal-Admin">
          <div className="modal-content-Admin">
            <span className="close" onClick={handleCloseModal} style={{ marginTop: '-20px', marginLeft: '890px'}}>&times;</span>

            <div className="modal-section">
            Aktualna Lista Prowadzących: <button onClick={handleInstructorsExport} className="ModalButton">Pobierz</button>
            <input type="file" id="fileInput" onChange={handleFileSelect} style={{display: 'none'}}></input>
            <label for="fileInput" class="ModalButton" style={{ backgroundColor: '#496683'}}> Przeglądaj </label>
            <button onClick={handleInstructorImport} className="ModalButton" style={{ backgroundColor: '#2c3e50'}}>Aktualizuj</button>
            </div>
            <br />
            <div className="modal-section">
            Aktualna Lista Przedmiotów: <button onClick={handleSubjectsExport} className="ModalButton">Pobierz</button>
            <input type="file" onChange={handleFileSelect} style={{display: 'none'}}></input>
            <label for="fileInput" class="ModalButton" style={{ backgroundColor: '#496683'}}> Przeglądaj </label>
            <button onClick={handleSubjectImport} className="ModalButton" style={{ backgroundColor: '#2c3e50'}}>Aktualizuj</button>
            </div>
            <br />
            <div className="modal-section">
            Aktualna Lista Przedmiotów i Prowadzących: <button onClick={handleOfferingsExport} className="ModalButton">Pobierz</button>
            <input type="file" onChange={handleFileSelect} style={{display: 'none'}}></input>
            <label for="fileInput" class="ModalButton" style={{ backgroundColor: '#496683'}}> Przeglądaj </label>
            <button onClick={handleOfferingImport} className="ModalButton" style={{ backgroundColor: '#2c3e50'}}>Aktualizuj</button>
            </div>
            <br />
            <div className="modal-section">
            <button onClick={handleClassTypesExport} className="ModalButton">Pobierz Rodzaje Zajęć</button>
            <button onClick={handleStudentsGroupsExport} className="ModalButton">Pobierz Grupy Studenckie</button>
            </div>
          </div>
        </div>
      )}
  
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
        <input type="number" placeholder="Semestr" value={semester} min='1' max='7' step ='1' onChange={(e) => setSemester(e.target.value)}  style={{
                border: "3px solid #2c3e50",
                borderRadius: '5px',
                outline: 'none',
                fontSize: '20px',
                color: '#2c3e50',
                backgroundColor: '#ecf0f1',
                transition: 'border-color 0.3s',
                }}/>
        <input type="" placeholder="Grupa Studencka" value={groupName} onChange={(e) => setgroupName(e.target.value)}  style={{
                border: "3px solid #2c3e50",
                borderRadius: '5px',
                outline: 'none',
                fontSize: '20px',
                color: '#2c3e50',
                backgroundColor: '#ecf0f1',
                transition: 'border-color 0.3s'
                }}/>
      {error && <div className="error-message" style={{
                marginTop: '-220px',
                fontSize: '18px',
                height: '20px',
                padding: '10px'
                }}>{error}</div>}
      </div>
      <div className="button-container">
        <button onClick={fetchSurveyChartDataForAllOfferings}>Pobierz Wyniki Ankiet</button>
      </div>
      <div className="button-container">
        <button onClick={toggleFilterVisibility}>Filtrowanie</button>
      </div>

      {isFilterVisible && (
        <div className="filter-box">
          <div className='filterbox-content'>
          <input
            type="text"
            placeholder="Wyszukaj Przedmiot po nazwie"
            value={filter}
            onChange={handleFilterChange}
            style={{
              border: "3px solid #2c3e50",
              borderRadius: '5px',
              outline: 'none',
              fontSize: '20px',
              color: '#2c3e50',
              backgroundColor: '#ecf0f1',
              transition: 'border-color 0.3s'
              }}
          />
          <button onClick={handleSearch}>Wyszukaj</button>
          <button onClick={clearFilter}>Usuń filtr</button>
          <button onClick={hideFilter}>Schowaj</button>
          </div>
        </div>
      )}

      </div>
      <div className="surveys-container-Admin">
      {(filter ? filteredData : allChartData).map((chartData, index) => {
          
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
                  Nazwa Przedmiotu: <strong>{chartData.SubjectName}</strong> <br /> Prowadzący: <strong>{chartData.InstructorTitle} </strong><strong>{chartData.InstructorName}</strong><br />
                  Rodzaj Zajęć: <strong>{chartData.ClassTypeName}</strong> </h2>
              <Bar style={{marginBottom:'35px'}}
                data={{
                  labels: ['1', '2', '3', '4', '5'],
                  datasets: [
                    {
                      label: 'Liczba Studentów',
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
                      label: 'Liczba Studentów',
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
                      label: 'Liczba Studentów',
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
                      label: 'Liczba Studentów',
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
                      label: 'Liczba Studentów',
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
                      label: 'Liczba Studentów',
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
                      label: 'Liczba Studentów',
                      data: chartDataArray7,
                      backgroundColor: 'rgba(53, 162, 235, 0.5)',
                      borderWidth: 2,
                      borderColor: 'black',
                    },
                  ],
                }}
                options = {createChartOptions('Zajęcia oceniam jako interesujące.')}
              />
              <div style={{
                marginBottom: '30px',
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", 
                fontSize: '24px', 
                fontWeight: '600', 
                color: '#2c3e50', 
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)', 
                textAlign: 'center',
                maxHeight: '200px', 
                overflowY: 'auto',
                border: '3px solid rgba(53, 162, 235, 0.5)',
                borderRadius: '5px',
                boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                padding: '15px'
                }}>
                  <strong>Odpowiedzi na pytania otwarte:</strong><br />
                    {chartData.OpenAnswer.map((answer, index) => (
                    <div key={index} style={{ 
                    marginTop: '10px', 
                    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", 
                    fontSize: '24px', 
                    fontWeight: '600', 
                    color: '#2c3e50', 
                    textShadow: '1px 1px 2px rgba(0,0,0,0.1)', 
                    textAlign: 'center', }}>{answer}</div>
                  ))}</div>
              </div>
          );
        })}
    </div>
  </div>
  );
};

export default Admin;