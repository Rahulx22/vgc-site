// Test the job parsing function with sample data
function decodeHtmlEntities(text) {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
}

function parseHtmlList(html) {
  const items = [];
  
  if (!html) return items;
  
  // Approach 1: Look for <li> tags with <p> inside
  const regex1 = /<li[^>]*>\s*<p[^>]*>([\s\S]*?)<\/p>\s*<\/li>/g;
  let match1;
  while ((match1 = regex1.exec(html)) !== null) {
    const content = match1[1].trim();
    if (content) {
      // Remove any nested HTML tags but preserve the text
      const cleanText = content.replace(/<[^>]*>/g, '').trim();
      if (cleanText) {
        items.push(decodeHtmlEntities(cleanText));
      }
    }
  }
  
  // If no items found, try <li> tags with direct text content
  if (items.length === 0) {
    const regex2 = /<li[^>]*>([\s\S]*?)<\/li>/g;
    let match2;
    while ((match2 = regex2.exec(html)) !== null) {
      const content = match2[1].trim();
      if (content) {
        // Remove any nested HTML tags but preserve the text
        const cleanText = content.replace(/<[^>]*>/g, '').trim();
        if (cleanText) {
          items.push(decodeHtmlEntities(cleanText));
        }
      }
    }
  }
  
  // If still no items, try a simpler approach for plain text
  if (items.length === 0) {
    // Try to split by line breaks or other separators
    const lines = html.split(/[\n\r]+/);
    for (const line of lines) {
      const cleanLine = line.replace(/<[^>]*>/g, '').trim();
      if (cleanLine && cleanLine.length > 10) { // Only add if it's substantial content
        items.push(decodeHtmlEntities(cleanLine));
      }
    }
  }
  
  return items;
}

function parseJobDescription(longDescription) {
  const responsibilities = [];
  const idealFor = [];
  
  if (!longDescription || typeof longDescription !== 'string') {
    return { responsibilities, idealFor };
  }
  
  try {
    // Try to find sections by h5 tags first
    if (longDescription.includes('<h5')) {
      // Split by h5 tags to get sections
      const sections = longDescription.split(/<h5[^>]*>([^<]+)<\/h5>/i);
      
      for (let i = 1; i < sections.length; i += 2) {
        const title = sections[i] ? sections[i].trim() : '';
        const content = sections[i + 1] || '';
        
        const items = parseHtmlList(content);
        
        if (title.toLowerCase().includes('responsibilities') || title.toLowerCase().includes('responsibility')) {
          responsibilities.push(...items);
        } else if (title.toLowerCase().includes('ideal')) {
          idealFor.push(...items);
        }
      }
    } else {
      // If no h5 tags, try to parse the entire content as a single section
      const items = parseHtmlList(longDescription);
      
      if (items.length > 0) {
        // Simple heuristic: if any item contains responsibility-related words, put in responsibilities
        const responsibilityKeywords = ['responsible', 'responsibility', 'task', 'duty', 'handle', 'manage', 'coordinate'];
        const idealKeywords = ['ideal', 'candidate', 'qualification', 'requirement', 'skill', 'experience'];
        
        const hasResponsibilityKeywords = items.some(item => 
          responsibilityKeywords.some(keyword => item.toLowerCase().includes(keyword))
        );
        
        const hasIdealKeywords = items.some(item => 
          idealKeywords.some(keyword => item.toLowerCase().includes(keyword))
        );
        
        if (hasResponsibilityKeywords || (!hasIdealKeywords && items.length > 2)) {
          responsibilities.push(...items);
        } else if (hasIdealKeywords) {
          idealFor.push(...items);
        } else {
          // Default to responsibilities if we can't determine
          responsibilities.push(...items);
        }
      }
    }
  } catch (error) {
    console.error('Error parsing job description:', error);
    // Fallback: try to parse the entire content as list items
    try {
      const items = parseHtmlList(longDescription);
      if (items.length > 0) {
        responsibilities.push(...items);
      }
    } catch (fallbackError) {
      console.error('Fallback parsing also failed:', fallbackError);
    }
  }
  
  return { responsibilities, idealFor };
}

// Test with sample data
const sampleJobDescription = `
<h5>Responsibilities</h5>
<ul>
<li><p>Responsible for developing and maintaining web applications</p></li>
<li><p>Collaborate with cross-functional teams to define, design, and ship new features</p></li>
<li><p>Work with outside data sources and APIs</p></li>
</ul>
<h5>Ideal For</h5>
<ul>
<li><p>Bachelor's degree in Computer Science or related field</p></li>
<li><p>2+ years of experience in web development</p></li>
<li><p>Proficiency in JavaScript, HTML, and CSS</p></li>
</ul>
`;

console.log('Testing job description parsing:');
const result = parseJobDescription(sampleJobDescription);
console.log('Result:', result);