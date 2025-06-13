import type { ReactNode} from 'react';
import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import type {
  StackProps,
  Theme,
  SxProps} from '@mui/material';
import {
  Stack,
  Typography,
  styled,
  Box,
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
  min-height: 200px;
`;

const StyledUploadStack = styled((props: StackProps) => (
  <Stack component="label" htmlFor="file-upload" spacing={2} {...props} />
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

const isValid = (fileContent: string, fileType: FileType): boolean => {
  if (fileType === 'csv') {
    return !!Papa.parse(fileContent).data.length;
  } else if (fileType === 'json') {
    try {
      JSON.parse(fileContent);
      return true;
    } catch {
      return false;
    }
  }

  return false;
};

const STATUS = {
  WAITING: 'WAITING',
  LOADING: 'LOADING',
  ERROR: 'ERROR',
  READY: 'READY',
  DRAGGING_FILE: 'DRAGGING_FILE',
};

type FileType = 'csv' | 'json';

type Props = {
  onChangeFileContent: (content: string | null) => void;
  fileType: FileType;
  description: ReactNode;
  acceptedFileType: string;
  invalidFileMessage: string;
  invalidContentMessage: string;
};

export const FileUpload = ({
  onChangeFileContent,
  fileType,
  description,
  acceptedFileType,
  invalidFileMessage,
  invalidContentMessage,
}: Props) => {
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
      const isCorrectType = file.type === acceptedFileType;
      const fileContent = reader.result;
      const isStringResult = typeof fileContent === 'string';
      const isFileValid = isStringResult && isValid(fileContent, fileType);

      if (!isCorrectType || !isStringResult) {
        setStatus(STATUS.ERROR);
        setErrorMessage(invalidFileMessage);
        onChangeFileContent(null);
        return;
      }

      if (!isFileValid) {
        setStatus(STATUS.ERROR);
        setErrorMessage(invalidContentMessage);
        onChangeFileContent(null);
        return;
      }

      setStatus(STATUS.READY);
      setErrorMessage(null);
      onChangeFileContent(fileContent);
    });

    reader.readAsText(file);
  }, [
    file,
    onChangeFileContent,
    invalidContentMessage,
    acceptedFileType,
    fileType,
    invalidFileMessage,
  ]);

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
          accept={acceptedFileType}
          onChange={handleChangeFile}
          onDragEnter={handleDragOver}
          onDragLeave={handleDragOut}
          onDragEnd={handleDragOut}
          onDrop={handleDragOut}
        />

        <StyledUploadStack>
          <Upload size={24} />

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
            {description}
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
