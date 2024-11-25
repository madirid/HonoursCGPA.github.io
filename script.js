const courses = {
    1: [],
    2: [],
    3: [],
    4: []
};

const gradeToPoint = {
    "A+": 4.0, "A": 3.75, "A-": 3.50,
    "B+": 3.25, "B": 3.00, "B-": 2.75,
    "C+": 2.5, "C": 2.25, "D": 2.0, "F": 0.0
};

document.getElementById("add-course").addEventListener("click", function() {
    const year = document.getElementById("year").value;
    const code = document.getElementById("course-code").value;
    const name = document.getElementById("course-name").value;
    const grade = document.getElementById("grade").value;
    const credit = parseFloat(document.getElementById("credit-hour").value);

    if (code && name && grade && credit) {
        courses[year].push({code, name, grade, credit});
        renderCourses();
    } else {
        alert("Please fill all fields");
    }
});

function renderCourses() {
    const tbody = document.getElementById("course-table").getElementsByTagName("tbody")[0];
    tbody.innerHTML = "";
    
    Object.keys(courses).forEach(year => {
        courses[year].forEach((course, index) => {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${year}</td>
                <td>${course.code}</td>
                <td>${course.name}</td>
                <td>${course.grade}</td>
                <td>${course.credit}</td>
                <td><button onclick="removeCourse(${year}, ${index})">Remove</button></td>
            `;
        });
    });
}

function removeCourse(year, index) {
    courses[year].splice(index, 1);
    renderCourses();
}

document.getElementById("calculate").addEventListener("click", function() {
    let totalCredit = 0;
    let totalPoints = 0;
    let sgpaResults = "";

    Object.keys(courses).forEach(year => {
        let yearPoints = 0;
        let yearCredit = 0;

        courses[year].forEach(course => {
            const gradePoint = gradeToPoint[course.grade];
            yearCredit += course.credit;
            yearPoints += gradePoint * course.credit;
        });

        const yearSgpa = (yearCredit > 0) ? (yearPoints / yearCredit).toFixed(2) : 0;
        sgpaResults += `<p>SGPA for Year ${year}: ${yearSgpa}</p>`;

        totalCredit += yearCredit;
        totalPoints += yearPoints;
    });

    const cgpa = (totalCredit > 0) ? (totalPoints / totalCredit).toFixed(2) : 0;
    const statusText = status(cgpa);

    document.getElementById("sgpa-results").innerHTML = sgpaResults;
    document.getElementById("cgpa").innerText = cgpa;
    document.getElementById("total-credit").innerText = totalCredit;
    document.getElementById("status").innerText = statusText;
});

function status(cgpa) {
    if (cgpa >= 3.00 && cgpa <= 4.00) {
        return "1st Class";
    } else if (cgpa >= 2.25 && cgpa <= 2.9) {
        return "2nd Class";
    } else if (cgpa >= 2.0 && cgpa <= 2.25) {
        return "3rd Class";
    } else {
        return "Fail";
    }
}

document.getElementById("reset").addEventListener("click", function() {
    document.getElementById("course-code").value = "";
    document.getElementById("course-name").value = "";
    document.getElementById("credit-hour").value = "";
    document.getElementById("year").value = "1";
    courses[1] = [];
    courses[2] = [];
    courses[3] = [];
    courses[4] = [];
    renderCourses();
    document.getElementById("sgpa-results").innerHTML = "";
    document.getElementById("cgpa").innerText = "";
    document.getElementById("total-credit").innerText = "";
    document.getElementById("status").innerText = "";
});

document.getElementById("print-result").addEventListener("click", function() {
    window.print();
});

document.getElementById("download-pdf").addEventListener("click", function() {
    const doc = new jsPDF();
    doc.text(`SGPA & CGPA Results\n\n${document.getElementById("sgpa-results").innerHTML}\nCGPA: ${document.getElementById("cgpa").innerText}\nTotal Credit: ${document.getElementById("total-credit").innerText}\nStatus: ${document.getElementById("status").innerText}`, 10, 10);
    doc.save("sgpa-cgpa-results.pdf");
});
