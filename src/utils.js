import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';

// --- Profile ---
export const prepareData = (user) => {
    return [
        { label: 'Birth Year', value: user.birthYear || ' ' },
        { label: 'Gender', value: user.sex || ' ' },
        { label: 'Religion', value: user.religion || ' ' },
        { label: 'Ethnicity', value: user.ethnicity || ' ' },
        { label: 'Province/City', value: user.city || ' ' },
        { label: 'Hometown', value: user.hometown || ' ' },
        { label: 'University', value: user.university || ' ' },
        { label: 'Major', value: user.major || ' ' },
        { label: 'Specialization', value: user.specialization || ' ' },
        { label: 'Study Status', value: user.studyStatus === '0' ? 'Ra trường' : 'Vẫn đang học' || ' ' },
        { label: 'Certificate', value: user.certificate || ' ' },
        { label: 'Hobby', value: user.hobby || ' ' },
        { label: 'Social Network Link', value: user.socialNetworkLink || ' ' },
        { label: 'Join Date', value: user.created ? new Date(user.created).toLocaleDateString() : ' ' }
    ];
};

// Export to Excel
export const exportToExcel = (user) => {
    const data = prepareData(user);

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'User Information');
    XLSX.writeFile(wb, 'user_information.xlsx');
};

// Export to PDF
export const exportToPDF = (user) => {
    const data = prepareData(user);
    const doc = new jsPDF();

    doc.addFont('/fonts/NotoSans-Regular.ttf', 'NotoSans', 'normal');
    doc.setFont('NotoSans');

    doc.setFontSize(16);
    doc.text(`Social World - Information ${user.name}`, 14, 20);

    let yOffset = 30;

    data.forEach(item => {
        doc.setFontSize(12);
        doc.text(`${item.label}: ${item.value}`, 14, yOffset);
        yOffset += 10;
    });

    doc.save('user_information.pdf');
};
