import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import axios from 'axios';

const ProposalEditor = () => {
    const [proposal, setProposal] = useState("");
    const [topic, setTopic] = useState(""); // State for topic
    const [description, setDescription] = useState(""); // State for description
  
    const handleTopicChange = (event) => {
      setTopic(event.target.value);
    };
  
    const handleDescriptionChange = (event) => {
      setDescription(event.target.value);
    };
  
    const generateProposal = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:8000/generate', {
          topic: topic,
          description: description
        });
        setProposal(response.data.proposal);
      } catch (error) {
        console.error("Error generating proposal:", error);
      }
    };
  
    const copyToClipboard = () => {
      navigator.clipboard.writeText(proposal).then(() => {
        alert('Proposal copied to clipboard!');
      }).catch((error) => {
        console.error("Error copying to clipboard:", error);
      });
    };
  
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Proposal Generator
        </Typography>
        <Box component="form" noValidate sx={{ mb: 2 }}>
          <TextField
            label="Enter Topic"
            variant="outlined"
            fullWidth
            margin="normal"
            value={topic}
            onChange={handleTopicChange}
          />
          <TextField
            label="Enter Description"
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={description}
            onChange={handleDescriptionChange}
          />
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={generateProposal}
          sx={{ mr: 2 }}
        >
          Generate Proposal
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={copyToClipboard}
        >
          Copy Proposal
        </Button>
        {proposal && (
          <Box sx={{ mt: 4, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
            <Typography variant="h6">Generated Proposal:</Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {proposal}
            </Typography>
          </Box>
        )}
      </Container>
    );
  };
  
  export default ProposalEditor;