const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = [
  { file: 'Index.tsx', title: 'VFRA | Digital Forensics, Cybercrime Investigation & Intelligence Solutions', desc: 'VFRA provides digital forensics, cybercrime investigation support, forensic reporting, intelligence workflows...' },
  { file: 'About.tsx', title: 'About Us | VFRA', desc: 'Learn about Vigilant Forensic Research and Analytics Pvt. Ltd. and our mission in cyber investigations.' },
  { file: 'Services.tsx', title: 'Services | VFRA', desc: 'Explore our digital forensic services and cybercrime investigation capabilities.' },
  { file: 'Events.tsx', title: 'Events & Training | VFRA', desc: 'Upcoming events, workshops and training programs by VFRA.' },
  { file: 'Contact.tsx', title: 'Contact Us | VFRA', desc: 'Get in touch with our forensic experts for investigation support.' },
  { file: 'Verify.tsx', title: 'Verify Certificate | VFRA', desc: 'Verify the authenticity of VFRA certificates.' },
  { file: 'TrackCase.tsx', title: 'Track Case | VFRA', desc: 'Track the status of your ongoing case investigation.' },
  { file: 'SubmitCase.tsx', title: 'Register a Case | VFRA', desc: 'Submit a new case for digital forensic investigation.' }
];

for (const { file, title, desc } of files) {
  const filePath = path.join(pagesDir, file);
  if (!fs.existsSync(filePath)) continue;
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (!content.includes('import { SEO }')) {
    content = `import { SEO } from "@/components/SEO";\n` + content;
    
    // Find the main return statement of the component
    // Assuming structure: return ( <something> ... </something> );
    // We will inject SEO right after return (
    
    const returnRegex = /return\s*\(\s*([<])/;
    content = content.replace(returnRegex, `return (\n    <>\n      <SEO title="${title}" description="${desc}" />\n      $1`);
    
    // find the matching closing bracket or just replace the last ); of the file if it's simpler
    // Actually, it's safer to just let the script add closing fragment if it added the opening.
    // We can replace the last `);` with `</>\n  );`
    const lastParenIndex = content.lastIndexOf(');');
    if (lastParenIndex !== -1) {
      content = content.substring(0, lastParenIndex) + '</>\n  );' + content.substring(lastParenIndex + 2);
    }
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
  }
}
