import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import {
  Stack,
  StackProps,
  Typography,
  styled,
  Box,
  Theme,
  SxProps,
} from '@mui/material';
import emotionStyled from '@emotion/styled';

import { Upload } from 'react-bootstrap-icons';

const HIDDEN_INPUT_SX: SxProps<Theme> = (theme) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  opacity: 0,
  width: '100%',
  zIndex: '1',
  cursor: 'pointer',
  '&:focus ~ label': {
    border: `2px solid ${theme.palette.primary.light}`,
    boxShadow: theme.shadows[4],
  },
});

const FOCUSED_HIDDEN_INPUT_SX: SxProps<Theme> = (theme) => ({
  '~ label': {
    border: `2px solid ${theme.palette.primary.light}`,
    boxShadow: theme.shadows[4],
  },
});

const UploadBoxWrapper = emotionStyled.div`
  position: relative;
  min-height: 250px;
`;

const StyledUploadStack = styled((props: StackProps) => (
  <Stack component="label" htmlFor="file-upload" spacing={4} {...props} />
))(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  cursor: 'pointer',
  overflow: 'hidden',
  display: 'flex',
  borderRadius: theme.shape.borderRadius,
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.brand['50'],
}));

const isValid = (fileContent: string) => !!Papa.parse(fileContent).data.length;

const STATUS = {
  WAITING: 'WAITING',
  LOADING: 'LOADING',
  ERROR: 'ERROR',
  READY: 'READY',
  DRAGGING_FILE: 'DRAGGING_FILE',
};

export const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [status, setStatus] = useState(STATUS.WAITING);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!file || !file.type) {
      setFileContent(null);

      return;
    }

    console.log('FILE', file);

    const reader = new FileReader();

    setStatus(STATUS.LOADING);

    reader.addEventListener('load', (e) => {
      console.log('READER LOADED', reader);

      const isCsv = file.type === 'text/csv';
      const fileContent = reader.result;
      const isStringResult = typeof fileContent === 'string';
      const isFileValid = isStringResult && isValid(fileContent);

      if (!isCsv || !isStringResult) {
        setStatus(STATUS.ERROR);
        setMessage('Invalid file, please try again with a csv file');
        return;
      }

      if (!isFileValid) {
        setStatus(STATUS.ERROR);
        setMessage('SOMETHING_WENT_WRONG');
        return;
      }

      setStatus(STATUS.READY);
      setMessage('FILE_UPLOAD_SUCCESS');
      setFileContent(fileContent);
    });

    reader.readAsText(file);
  }, [file]);

  const reset = () => {
    setFile(null);
    setFileContent(null);
    setStatus(STATUS.WAITING);
    setMessage(null);
  };

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFile(e.target.files?.[0] ?? null);
  const handleDragOver = () => setStatus(STATUS.DRAGGING_FILE);
  const handleDragOut = () => setStatus(STATUS.WAITING);

  return (
    <>
      {/* TODO: Message handling */}
      {!!message && message}
      <UploadBoxWrapper>
        <Box
          sx={[
            HIDDEN_INPUT_SX,
            status === STATUS.DRAGGING_FILE && FOCUSED_HIDDEN_INPUT_SX,
          ]}
          component="input"
          id="file-upload"
          type="file"
          onChange={handleChangeFile}
          onDragEnter={handleDragOver}
          onDragLeave={handleDragOut}
          onDragEnd={handleDragOut}
          onDrop={handleDragOut}
        ></Box>

        <StyledUploadStack>
          <Upload size={32} />
          <Typography variant="h4" component="p" textAlign="center">
            {file ? file.name : 'Choose a file or drag it here'}
          </Typography>
          <Typography textAlign="center">
            Upload a <em>.csv</em> file from the data request sheet in
            collaboration with NetZeroCities
          </Typography>
        </StyledUploadStack>
      </UploadBoxWrapper>
    </>
  );
};
