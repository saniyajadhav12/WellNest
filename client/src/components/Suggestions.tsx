// import React from 'react';

// interface Props {
//   suggestions: string[];
// }

// const Suggestions: React.FC<Props> = ({ suggestions }) => {
//   if (suggestions.length === 0) return null;

//   return (
//     <div style={{ marginTop: '1.5rem' }}>
//       <h2>🧘 Your Self-Care Suggestions</h2>
//       <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem' }}>
//         {suggestions.map((item, index) => (
//           <li key={index} style={{ marginBottom: '0.5rem' }}>
//             {item}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Suggestions;


import React from 'react';

interface Props {
  suggestions: string[];
}

const Suggestions: React.FC<Props> = ({ suggestions }) => {
  if (suggestions.length === 0) return null;

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>Wellness Suggestions</h2>
      <ul>
        {suggestions.map((item, index) => (
          <li key={index} style={{ padding: '6px 0' }}>
            🌿 {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Suggestions;
