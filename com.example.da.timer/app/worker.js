/*
 * Copyright 2016 Sony Corporation
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions, and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS ``AS IS'' AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
 * OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
 * SUCH DAMAGE.
 */

/**
 * Check the locality every 60 seconds. The polling interval is defined in Manifest.json file.
 * If locality is changed, start the segment and speak the loacality.
 * @param  {string} trigger null is set.
 * @param  {object} args    null is set.
 */
da.segment.onstart = function (trigger, args) {
    // Get the current address (locality)
    console.log('[worker]onstart');
    var callbacks = {
        onsuccess: function (result) {
            console.log('getCurrentPosition success.' + result.latitude + "," + result.longitude);
            var storage = new da.Storage();
            storage.setItem("current_position", result);
            // ‚±‚±‚ÅˆÊ’uŽæ“¾‚ÆŒvŽZ.
            var diff_latitude = Math.abs(result.latitude - 35.46568);
            var diff_longitude = Math.abs(result.longitude - (139.62351));
            if ((diff_latitude < 0.002) && (diff_longitude < 0.002)) {
                da.requestStartSegment('full', {
                    cueVoice: 'launchRulesAnnounce',
                    cueVoiceArgs: ['worker'],
                    args: result
                });
            } else {
                da.stopWorker();
            }
        },
        onerror: function (error) {
            console.log('getCurrentPosition fail.' + error.message);
        }
    };
    var option = {
        timeout: 30000,
        enablehighaccuracy: true
    };
    var geo = new da.Geolocation();
    geo.getCurrentPosition(callbacks, option);
};
