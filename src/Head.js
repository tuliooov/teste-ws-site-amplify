import React, { useState } from 'react';

function Head() {  
  const aplicativoDados = JSON.parse(localStorage.getItem("aplicativoCF")) 


  return (
    aplicativoDados ? (
      <span>
        <title>{aplicativoDados.projectName}</title>
      </span>
    ): null
  );
}

export default Head;
