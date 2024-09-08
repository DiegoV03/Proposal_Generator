import React, { useState, useEffect, useRef } from 'react';
import { Button, Typography, Container, Box, TextField, CircularProgress } from '@mui/material';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

const ProposalEditor = () => {
  const [proposal, setProposal] = useState("");
  const [description, setDescription] = useState(""); // State for description
  const [loading, setLoading] = useState(false); // State for loading
  const quillRef = useRef(null); // Reference for Quill editor

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleProposalChange = (content) => {
    setProposal(content);
  };

  const generateProposal = async () => { //sends request to backend to generate proposal
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/generate', {
        description: description
      });
      const formattedProposal = response.data.proposal.replace(/\n/g, '<br>');
      setProposal(formattedProposal);
    } catch (error) {
      console.error("Error generating proposal:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => { //allows the proposal to be copied to the clipboard
    const tempElement = document.createElement('div');
    tempElement.innerHTML = proposal;
  
    let textToCopy = tempElement.innerHTML;
    textToCopy = textToCopy.replace(/<\/p><p><br><\/p><p>/g, '\n\n').replace(/<\/p><p>/g, '\n').replace(/<p>/g, '').replace(/<\/p>/g, '');
  
    navigator.clipboard.writeText(textToCopy).then(() => {
      alert('Proposal copied to clipboard!');
    }).catch((error) => {
      console.error("Error copying to clipboard:", error);
    });
  };
  
  useEffect(() => { //allows quill box to grow
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      editor.root.style.minHeight = '400px';
      editor.root.style.height = 'auto';
    }
  }, [proposal]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, ml: 'auto', mr: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Business Proposal Generator
      </Typography>

      <Box display="flex" alignItems="center" mb={2}>
        <TextField //insert description
          label="Description"
          variant="outlined"
          fullWidth
          value={description}
          onChange={handleDescriptionChange}
          sx={{ mr: 2 }}
          disabled={loading}
        />
        <Button // Generate button
          variant="contained"
          color="primary"
          onClick={generateProposal}
          sx={{ mr: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Generate Proposal'}
        </Button>

        <Button //Copy button
          variant="outlined"
          color="secondary"
          onClick={copyToClipboard}
          disabled={loading}
        >
          Copy Proposal
        </Button>
      </Box>

      <ReactQuill //Editable section similar to Word
        ref={quillRef}
        value={proposal}
        onChange={handleProposalChange}
        theme="snow"
        style={{ minHeight: '400px', height: 'auto', marginBottom: '20px' }}
        readOnly={loading}
      />
    </Container>
  );
};

export default ProposalEditor;