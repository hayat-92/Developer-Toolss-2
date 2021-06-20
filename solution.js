const { default: Axios } = require("axios");

/* Step 1: Adding Submission column header to the table -
 *         a. Find the table header element.
 *         b. Create the Submission header <th> element.
 *         c. Add this element to the header.
 *              - Add the element only when this column doesn't exist (Optional)
 */
function addSubmissionColumnHeader() {
  let tableRow = document.querySelector('#question-app > div > div:nth-child(2) > div.question-list-base > div.table-responsive.question-list-table > table > thead > tr');

  let tableHead = document.createElement('th');

  tableHead.setAttribute('class', 'reactable-th-status reactable-header-sortable');

  tableHead.setAttribute('role', 'button');

  tableHead.setAttribute('tabindex', '0');

  let strongTag = document.createElement('strong');

  strongTag.innerText = 'Submissions';

  tableHead.appendChild(strongTag);


  tableRow.appendChild(tableHead);
}


/* Step 2: Find the API endpoint for retrieving all problems
 */
function getApiUrl() {
  return 'https://leetcode.com/api/problems/all/';
}

/* Step 3: Get all the problems as an Array in the following object format by using fetch -
 *          {
 *              id: "",
 *              total_submitted: "",
 *              total_acs: ""
 *          }
 */
async function getAllProblems(apiUrl) {
  try {
    var response = await fetch(apiUrl);
  } catch (error) {
    return error;
  }
  let dataArray = await response.json();
  let filtered_problems = dataArray.stat_status_pairs;
  let reduced_array = [];
  filtered_problems.forEach(element => {
    let reduced_object = { id: element.stat.frontend_question_id, total_submitted: element.stat.total_submitted, total_acs: element.stat.total_acs };
    reduced_array.push(reduced_object);
  });
  return reduced_array;
}



/* Step 4: Getting every problem's row in the form of an array
 */
function getAllProblemRowElements() {
  let trElements = document.querySelectorAll('#question-app > div > div:nth-child(2) > div.question-list-base > div.table-responsive.question-list-table > table > tbody.reactable-data > tr');
  let arry = Array.from(trElements);
  return arry;
}

/* Step 5: Add "total_acs"/"total_submitted" to each row element of the table on the page. 
        Iterate through each row element and add a new <td> containing the submission data in the provided format
   Note: Use "innerHTML" or "textContent" to access element's content. Don't use "innerText"
 */
function addSubmissionsToEachProblem(allProblemRowElements, allProblems) {
  for (x of allProblemRowElements) {
    let idt = x.querySelector(":nth-child(2)").innerHTML;
    let idval = parseInt(idt);
    function findObj(element) {
      return element.id === idval;
    }

    var corsObj = allProblems.find(findObj);

    let submission = `${corsObj.total_acs}/${corsObj.total_submitted}`;
    let newcol = document.createElement("td");
    newcol.innerHTML = submission;
    x.appendChild(newcol);
  }
}


/* Step 6: Putting it all together
 */
async function createSubmissionColumnForLeetCode() {
  // Function 1
  function addSubmissionColumnHeader() {
    var tablehead = document.querySelector("tr");
    var newcol = document.createElement("th");

    newcol.setAttribute(
      "class",
      "reactable-th-status reactable-header-sortable"
    );
    newcol.setAttribute("role", "button");
    newcol.setAttribute("tabindex", "0");
    var strchild = document.createElement("strong");
    strchild.innerText = "Submissions";
    newcol.appendChild(strchild);
    tablehead.appendChild(newcol);
  }

  // function 2
  function getApiUrl() {
    return "https://leetcode.com/api/problems/all/";
  }

  // Function 3
  async function getAllProblems(apiUrl) {
    var response = await fetch(apiUrl);
    var raw = await response.json();
    var rawarray = raw.stat_status_pairs;
    var arry = [];
    for (x of rawarray) {
      var obj = {};
      const inner = x.stat;
      obj.id = inner.frontend_question_id;
      obj.total_submitted = inner.total_submitted;
      obj.total_acs = inner.total_acs;
      arry.push(obj);
    }
    return arry;
  }

  // Function 4
  function getAllProblemRowElements() {
    var raw = document.querySelectorAll(
      "#question-app > div > div:nth-child(2) > div.question-list-base > div.table-responsive.question-list-table > table > tbody.reactable-data > tr"
    );
    return Array.from(raw);
  }

  // Function 5
  function addSubmissionsToEachProblem(allProblemRowElements, allProblems) {
    for (x of allProblemRowElements) {
      let idt = x.querySelector(":nth-child(2)").innerHTML;
      let idval = parseInt(idt);
      function findObj(element) {
        return element.id === idval;
      }

      var corsObj = allProblems.find(findObj);

      let submission = `${corsObj.total_acs}/${corsObj.total_submitted}`;
      let newcol = document.createElement("td");
      newcol.innerHTML = submission;
      x.appendChild(newcol);
    }
  }

  let apiUrl = getApiUrl();
  let allProblems = await getAllProblems(apiUrl);
  let allProblemRowElements = getAllProblemRowElements();
  addSubmissionColumnHeader();
  addSubmissionsToEachProblem(allProblemRowElements, allProblems);
}

/* Step 7: Additional code for making script tampermonkey ready. This is done so that the script is properly executed when we visit https://leetcode.com/problemset/all/
 */
let tableCheck = setInterval(() => {
  var checkr=document.querySelector("#question-app > div > div:nth-child(2) > div.question-list-base > div.table-responsive.question-list-table > table");
  if(Boolean(checkr)===true){
    createSubmissionColumnForLeetCode();
    clearInterval(tableCheck);
  }
}, 100);

module.exports = { getApiUrl, getAllProblems, addSubmissionColumnHeader, getAllProblemRowElements, addSubmissionsToEachProblem, createSubmissionColumnForLeetCode };
