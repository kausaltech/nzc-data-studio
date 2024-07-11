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
  Button,
  Alert,
  AlertTitle,
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
  <Stack component="label" htmlFor="file-upload" spacing={3} {...props} />
))(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  cursor: 'pointer',
  overflow: 'hidden',
  display: 'flex',
  p: 4,
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

type Props = {
  onChangeFileContent: (content: string | null) => void;
};

export const FileUpload = ({ onChangeFileContent }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState(STATUS.WAITING);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!file || !file.type) {
      onChangeFileContent(null);
      setErrorMessage(null);

      return;
    }

    const reader = new FileReader();

    setStatus(STATUS.LOADING);

    reader.addEventListener('load', () => {
      const isCsv = file.type === 'text/csv';
      const fileContent = reader.result;
      const isStringResult = typeof fileContent === 'string';
      const isFileValid = isStringResult && isValid(fileContent);

      if (!isCsv || !isStringResult) {
        setStatus(STATUS.ERROR);
        setErrorMessage(
          'Invalid file selected. Please upload a valid CSV file.'
        );
        onChangeFileContent(null);
        return;
      }

      if (!isFileValid) {
        setStatus(STATUS.ERROR);
        setErrorMessage(
          'Failed to process the file. It might be corrupt or in an invalid format. Please contact support for assistance.'
        );
        onChangeFileContent(null);
        return;
      }

      setStatus(STATUS.READY);
      setErrorMessage(null);
      onChangeFileContent(fileContent);
    });

    reader.readAsText(file);
  }, [file, onChangeFileContent]);

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFile(e.target.files?.[0] ?? null);
  const handleDragOver = () => setStatus(STATUS.DRAGGING_FILE);
  const handleDragOut = () => setStatus(STATUS.WAITING);

  return (
    <Stack spacing={1}>
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
        />

        <StyledUploadStack>
          <Upload size={32} />

          {file ? (
            <Typography variant="h4" component="p" textAlign="center">
              {file.name}
            </Typography>
          ) : (
            <Stack spacing={1} alignItems="center">
              <Button size="large" variant="contained">
                Choose a file
              </Button>
              <Typography
                fontWeight="bold"
                variant="body1"
                component="p"
                textAlign="center"
              >
                or drag it here
              </Typography>
            </Stack>
          )}

          <Typography color="text.secondary" textAlign="center" variant="body2">
            Upload a <em>.csv</em> file from the data request sheet in
            collaboration with NetZeroCities
          </Typography>
        </StyledUploadStack>
      </UploadBoxWrapper>

      {status === 'ERROR' && !!errorMessage && (
        <Alert severity="error">
          <AlertTitle>{errorMessage}</AlertTitle>
        </Alert>
      )}
    </Stack>
  );
};
