/*!
    a chrome extension to help with ilias platform
    Copyright (C) 2025  itsrye.dev
    @license GPL-3.0-or-later

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
import "../shim";
import $ from "jquery";

export function downloadLinks(urls: string[]) {
  urls.forEach((url, index) => {
    setTimeout(() => {
      console.log(`Opening ${index + 1}/${urls.length}: ${url}`);

      let $tempLink = $(
        '<a href="' + url + '" hidden="true" download target="_blank"></a>',
      );
      $("body").append($tempLink);
      $tempLink[0]?.click();
      $tempLink.remove();
    }, index * 500); // 500ms zwischen jedem Download
  });
}
