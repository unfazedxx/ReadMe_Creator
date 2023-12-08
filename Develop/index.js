// TODO: Include packages needed for this application
const inquirer = require('inquirer');
const fs = require('fs');
const { cpuUsage } = require('process');
const questions = ({ title, description, itemsTOC, installation, usage, licenses, githubUsername, emailAddress, contributing, tests, }) =>


// TODO: Create an array of questions for user input

  `
  ## ${title}
    
  ## Description
  ${description}

  ## Table of Contents 
  ${itemsTOC}

  ## Installation
  Installation instructions:
  ${installation}
    
  ## Usage
  Instructions for use:
  ${usage}

  ## Licenses
  This project uses the ${licenses}. Please visit their site for futher information. 
    
  ## Contributing 
  ${contributing}
    
  ## Tests
  ${tests}
    
  ## Questions 
  Please reach out if there are any additional questions: ${emailAddress}
  Find more projects located on my github page: https://github.com/${githubUsername}       
  `;


//what the user will be prompted with, 
inquirer
  .prompt([

    {
      name: 'title',
      type: 'input',
      message: 'What is the title of your project?',
    },
    {
      name: 'description',
      type: 'input',
      message: 'Please provide a description of your project:',
    },
    // {
    //   name: 'tableOfContents',
    //   type: 'confirm',
    //   message: 'Please provide the table of contents, (if none, plesae enter "None"):',
    // },
    {
      name: 'installation',
      type: 'input',
      message: 'Please provide notes for installation, (if none, plesae enter "None"):',
    },
    {
      name: 'usage',
      type: 'input',
      message: 'Please provide any instructions on how to use this project, (if none, plesae enter "None"):',
    },
    {
      name: 'licenses',
      type: 'checkbox',
      message: 'Please select the license used in your project:',
      choices: ['Attribution License (BY) - (https://opendatacommons.org/licenses/by/)', 'Open Database License (ODbL) - (https://opendatacommons.org/licenses/odbl/) ', 'Public Domain Dedication and License (PDDL) - (https://opendatacommons.org/licenses/pddl/)', 'None']
    },
    {
        name: 'githubUsername',
        type: 'input',
        message: 'Please enter your github username:',
      },
      {
        name: 'emailAddress',
        type: 'input',
        message: 'Please enter your email address for any additional questions:',
      },
    {
        name: 'contributing',
        type: 'input',
        message: 'Please enter information for users looking to contribute to your project (ex. submit issues, or request feature and pull requests):',
      },
      {
        name: 'tests',
        type: 'input',
        message: 'Please provide any tests for this project, and how to run the tests (if none, plesae enter "None"):',
      },
      {
        name: 'tableOfContents',
        type: 'confirm',
        message: 'Would you like to include a table of contents?',
        default: false, 
      },
          
    ])
    .then(async (answers) => {
      // if user wants to include a table of contents, prompt for the items
      if (answers.tableOfContents) {
        const ToCItems = await inquirer.prompt([
          {
            name: 'itemsTOC',
            type: 'editor',
            message: 'Please list each Table of Contents item (one per line), hit esc followed by ZZ to save and quit the editor:',
          },
        ]);
  
        // Process items only if they are provided and not just whitespace
        if (ToCItems.items !== undefined && ToCItems.items !== null && ToCItems.items.trim() !== '') {
          // Modify the answers object to include the formatted table of contents
          answers.tableOfContents = ToCItems.items
            .split('\n')
            .map((item, index) => `${index + 1}. ${item.trim()}`)  
            .join('\n');
  
          // generate the markdown content
          const markdownContent = generateMarkdown(answers);
  
          // write the markdown content to a file 
          fs.writeFileSync('README.md', markdownContent);
          console.log('README.md file has been generated successfully!');
        } else {
          console.log('No additional information will be added to the table of contents.');
        }
      } else {
        console.log('No additional information will be added.');
      }
  
      // take the answers from the user and assign them into a constant called READMEPageContent
      const READMEPageContent = questions(answers);
  
      // write the file 'README.md', enter in the README page content information, and return a response if it was successful or not.
      fs.writeFile('README.md', READMEPageContent, (err) =>
        err ? console.log(err) : console.log('Successfully created README.md!')
      );
    });