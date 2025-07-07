import { useEffect, useState } from 'react';
import './index.css';
import html2pdf from 'html2pdf.js';

const Cp = ["12302040501001", "12302040501008", "12302040501009", "12302040501010", "12302040501012", "12302040501014", "12302040501015", "12302040501018", "12302040501020", "12302040501023", "12302040501024", "12302040501025", "12302040501027", "12302040501028", "12302040501029", "12302040501030", "12302040501031", "12302040501032", "12302040501035", "12302040501036", "12302040501037", "12302040501039", "12302040501041", "12302040501042", "12302040501044", "12302040501046", "12302040501048", "12302040501051", "12302040501052", "12302040501053", "12302040501054", "12302040501057", "12302040501059", "12302040501060", "12302040501063", "12302040501068", "12302040501073", "12302040501079", "12302040501086", "12302040501087"];
const CPD2D = ["12402040503001", "12402040503003", "12402040503004", "12402040503005", "12402040503006", "12402040503007"];
const CSD = ["12302130501004", "12302130501005", "12302130501013", "12302130501015", "12302130501017", "12302130501020", "12302130501023", "12302130501026", "12302130501028", "12302130501036", "12302130501038", "12302130501042", "12302130501048", "12302130501050", "12302130501051", "12302130501053", "12302130501054", "12302130501064", "12302130501066", "12302130501068", "12302130501075", "12302130501077", "12302130501080", "12302130501081", "12302130501083"];
const IT = ["12302080501004", "12302080501017", "12302080501018", "12302080501024", "12302080501042", "12302080501047", "12302080501048", "12302080501051", "12302080501054", "12302080501057", "12302080501066"];
const ITD2D = ["12402080503001"];

const App = () => {
  const [date, setDate] = useState('');
  const [checkboxStates, setCheckboxStates] = useState({});

  const allStudents = [
    ...Cp.map(id => ({ id, branch: 'CP' })),
    ...CPD2D.map(id => ({ id, branch: 'CPD2D' })),
    ...CSD.map(id => ({ id, branch: 'CSD' })),
    ...IT.map(id => ({ id, branch: 'IT' })),
    ...ITD2D.map(id => ({ id, branch: 'ITD2D' })),
  ];

  const getKey = (student) => `${student.branch}-${student.id}`;

  useEffect(() => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yy = String(today.getFullYear()).slice(-2);
    setDate(`${dd}/${mm}/${yy}`);

    const initialStates = {};
    allStudents.forEach(s => {
      initialStates[getKey(s)] = false;
    });
    setCheckboxStates(initialStates);
  }, []);

  const handleMarkAll = (value) => {
    const updated = {};
    allStudents.forEach(s => {
      updated[getKey(s)] = value;
    });
    setCheckboxStates(updated);
  };

  const handleCheckboxChange = (branch, id) => {
    const key = `${branch}-${id}`;
    setCheckboxStates(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const renderCheckboxes = (arr, branch) => (
    <div className="flex flex-col gap-2 mt-3">
      {arr.map((id, index) => {
        const key = `${branch}-${id}`;
        return (
          <div
            key={key}
            className={`flex justify-between items-center p-2 rounded-md shadow text-sm ${checkboxStates[key] ? 'bg-green-200' : 'bg-white'}`}
          >
            <span>{index + 1}. {id}</span>
            <input
              type="checkbox"
              checked={checkboxStates[key] || false}
              onChange={() => handleCheckboxChange(branch, id)}
              className="w-4 h-4 accent-green-600"
            />
          </div>
        );
      })}
    </div>
  );
  // const downloadPresentListPDF = () => {
  //   const presentStudents = allStudents.filter(s => checkboxStates[getKey(s)]);

  //   const getBranchData = (branch) =>
  //     presentStudents.filter(s => s.branch === branch).map(s => s.id);

  //   const renderBranchLine = (branch, ids) => {
  //     if (ids.length === 0) return '';
  //     return `
  //       <h3 style="font-size: 18px; margin-bottom: 8px;">${branch}</h3>
  //       <p style="font-size: 14px; margin-bottom: 20px;">${ids.join(', ')}</p>
  //     `;
  //   };

  //   const CP = getBranchData('CP');
  //   const CPD2D = getBranchData('CPD2D');
  //   const CSD = getBranchData('CSD');
  //   const IT = getBranchData('IT');
  //   const ITD2D = getBranchData('ITD2D');

  //   const content = document.createElement('div');
  //   content.innerHTML = `
  //     <div style="font-family: Arial, sans-serif; padding: 20px;">
  //       <h1 style="text-align: center; font-size: 28px;">Computer Engineering</h1>
  //       <p style="text-align: center; font-size: 16px; margin: 4px 0;">Subject: Advanced Java</p>
  //       <p style="text-align: center; font-size: 14px; margin-bottom: 20px;">Date: ${date}</p>

  //       ${renderBranchLine('CP', CP)}
  //       ${renderBranchLine('CPD2D', CPD2D)}
  //       ${renderBranchLine('CSD', CSD)}
  //       ${renderBranchLine('IT', IT)}
  //       ${renderBranchLine('ITD2D', ITD2D)}
  //     </div>
  //   `;

  //   html2pdf().from(content).set({
  //     margin: 0,
  //     filename: `Present_Students_${date.replace(/\//g, '-')}.pdf`,
  //     image: { type: 'jpeg', quality: 1 },
  //     html2canvas: { scale: 2 },
  //     jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  //   }).save();
  // };


  const downloadPresentListPDF = () => {
    const presentStudents = allStudents.filter(s => checkboxStates[getKey(s)]);

    const getLastTwoDigits = (id) => id.slice(-2);

    const getBranchData = (branch) =>
      presentStudents.filter(s => s.branch === branch).map(s => getLastTwoDigits(s.id));

    const renderBranchLine = (branch, ids) => {
      if (ids.length === 0) return '';
      return `
      <h3 style="font-size: 18px; margin-bottom: 8px;">${branch}</h3>
      <p style="font-size: 14px; margin-bottom: 20px;">${ids.join(', ')}</p>
    `;
    };

    const CP = getBranchData('CP');
    const CPD2D = getBranchData('CPD2D');
    const CSD = getBranchData('CSD');
    const IT = getBranchData('IT');
    const ITD2D = getBranchData('ITD2D');

    const content = document.createElement('div');
    content.innerHTML = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h1 style="text-align: center; font-size: 28px;">Computer Engineering</h1>
      <p style="text-align: center; font-size: 16px; margin: 4px 0;">Subject: Advanced Java</p>
      <p style="text-align: center; font-size: 14px; margin-bottom: 20px;">Date: ${date}</p>
      
      ${renderBranchLine('CP', CP)}
      ${renderBranchLine('CPD2D', CPD2D)}
      ${renderBranchLine('CSD', CSD)}
      ${renderBranchLine('IT', IT)}
      ${renderBranchLine('ITD2D', ITD2D)}
    </div>
  `;

    html2pdf().from(content).set({
      margin: 0,
      filename: `Present_Students_${date.replace(/\//g, '-')}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    }).save();
  };




  return (
    <div className="max-w-7xl mx-auto px-4 py-6 text-center">
      <h1 className="text-4xl font-bold mb-2">Attendance</h1>
      <h2 className="text-xl font-medium mb-2">Subject: Advanced Java</h2>
      <h3 className="text-md text-gray-600 mb-6">Date: {date}</h3>

      <div className="flex justify-center gap-4 mb-8 flex-wrap no-print">
        <button
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-xl transition"
          onClick={() => handleMarkAll(true)}
        >
          Mark All Present
        </button>
        <button
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-xl transition"
          onClick={() => handleMarkAll(false)}
        >
          Mark All Absent
        </button>
        <button
          onClick={downloadPresentListPDF}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-xl transition"
        >
          Download Present Students PDF
        </button>
      </div>

      <div className="text-left grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-2 text-center">Computer Science and Design</h3>
          {renderCheckboxes(CSD, 'CSD')}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2 text-center">Information Technology</h3>
          {renderCheckboxes(IT, 'IT')}
          <h3 className="text-lg font-semibold mb-2 mt-5 text-center">Information Technology (D2D)</h3>
          {renderCheckboxes(ITD2D, 'ITD2D')}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2 text-center">Computer Engineering</h3>
          {renderCheckboxes(Cp, 'CP')}
          <h3 className="text-lg font-semibold mb-2 mt-5 text-center">Computer Engineering (D2D)</h3>
          {renderCheckboxes(CPD2D, 'CPD2D')}
        </div>
      </div>
    </div>
  );
};

export default App;
