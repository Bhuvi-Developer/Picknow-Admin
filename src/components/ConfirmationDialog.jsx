import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const ConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  content,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'confirm', // 'confirm', 'success', 'delete'
  details = null
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon sx={{ color: 'success.main', fontSize: 40, mb: 2 }} />;
      case 'delete':
        return <ErrorIcon sx={{ color: 'error.main', fontSize: 40, mb: 2 }} />;
      default:
        return null;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'success':
        return 'success';
      case 'delete':
        return 'error';
      default:
        return 'primary';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>
        {getIcon()}
        {title}
      </DialogTitle>
      <DialogContent>
        <Typography align="center" gutterBottom>
          {content}
        </Typography>
        {details && (
          <Box sx={{ mt: 2, bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Details:
            </Typography>
            {Object.entries(details).map(([key, value]) => (
              <Typography key={key} variant="body2" sx={{ mb: 0.5 }}>
                <strong>{key}:</strong> {value}
              </Typography>
            ))}
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'center' }}>
        {type !== 'success' && (
          <Button onClick={onClose} variant="outlined">
            {cancelText}
          </Button>
        )}
        <Button
          onClick={onConfirm}
          variant="contained"
          color={getColor()}
          autoFocus={type === 'success'}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog; 