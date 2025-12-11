import { library, dom } from "@fortawesome/fontawesome-svg-core";
import {
  faDownload,
  faFileArrowDown,
  faBinoculars,
  faInfo,
} from "@fortawesome/free-solid-svg-icons";

library.add(faDownload, faFileArrowDown, faBinoculars, faInfo);
dom.watch();
