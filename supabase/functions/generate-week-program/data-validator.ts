
export const parseAndValidateProgram = (content: string): any[] => {
  let programData;
  
  try {
    // Remove markdown code block markers if present
    const cleanContent = content.replace(/```json\n?/g, '').replace(/\n?```/g, '');
    programData = JSON.parse(cleanContent);
  } catch (parseError) {
    console.error('JSON parse error:', parseError);
    console.error('Raw content:', content);
    throw new Error('Ongeldige AI response format');
  }

  // Validate and clean up the program data
  return programData.map((dag: any) => ({
    ...dag,
    oefeningen: dag.oefeningen?.map((oef: any) => ({
      ...oef,
      tijdInMinuten: oef.tijdInMinuten || parseInt(oef.tijd) || 15,
      vragen: oef.vragen?.slice(0, 20) || [] // Limit questions
    })) || []
  }));
};
