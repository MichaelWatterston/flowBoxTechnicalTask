import { UI_MESSAGES } from '../../constants/messages';
import { UploadIcon } from './Icons';

import '../../styles/imageDropZone.css';

export default function ImageDropZone() {
  return (
    <div className="drop-zone">
      <div className="drop-zone__box">
        <UploadIcon />
        <p>{UI_MESSAGES.dragDropText}</p>
      </div>
    </div>
  );
}
