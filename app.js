const form = document.querySelector('form');
const subjectList = document.querySelector('#subject');

async function loadSubjects() {
    const response = await fetch('subjects.php');
    if (!response.ok) {
        throw new Error('Could not load subjects');
    }
    const subjects = await response.json();

    for (const s of subjects) {
        const option = document.createElement('option');
        option.value = s.id;
        option.textContent = s.name;
        subjectList.append(option);
    }
}

loadSubjects().catch(console.error);