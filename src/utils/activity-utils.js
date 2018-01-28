/**
 * Copyright 2017 The __PROJECT__ Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {AbortError} from '../api/abort-error';
import {ActivityResultCode} from 'web-activities/activity-ports';


/**
 * @param {!web-activities/activity-ports.ActivityPort} port
 * @param {string} requireOrigin
 * @param {boolean} requireOriginVerified
 * @param {boolean} requireSecureChannel
 * @return {!Promise<!Object>}
 */
export function acceptPortResult(
    port,
    requireOrigin,
    requireOriginVerified,
    requireSecureChannel) {
  return port.acceptResult().then(result => {
    if (result.ok) {
      if (port.getTargetOrigin() != requireOrigin ||
          requireOriginVerified && !port.isTargetOriginVerified() ||
          requireSecureChannel && !port.isSecureChannel()) {
        throw new Error('channel mismatch');
      }
      return result.data;
    }
    if (result.code == ActivityResultCode.CANCELED) {
      throw new AbortError();
    }
    if (result.error) {
      throw result.error;
    }
    throw new Error();
  });
}