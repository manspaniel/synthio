// export const WebMGL = {
//   Video: WebMGLVideo,
//   fromImageArray: function (images: any, fps: any) {
//     return toWebM(
//       images.map(function (image: any) {
//         var webp: any = parseWebP(parseRIFF(window.atob(image.slice(23))));
//         webp.duration = 1000 / fps;
//         return webp;
//       })
//     );
//   },
//   toWebM: toWebM,
// };

const atob = window && window.atob;

function WebMGLError(message: string) {
  return new Error("[WebMGL] " + message);
}

function toWebM(frames: any) {
  var info = checkFrames(frames);
  var counter = 0;
  var EBML = [
    {
      id: 0x1a45dfa3, // EBML
      data: [
        {
          data: 1,
          id: 0x4286, // EBMLVersion
        },
        {
          data: 1,
          id: 0x42f7, // EBMLReadVersion
        },
        {
          data: 4,
          id: 0x42f2, // EBMLMaxIDLength
        },
        {
          data: 8,
          id: 0x42f3, // EBMLMaxSizeLength
        },
        {
          data: "webm",
          id: 0x4282, // DocType
        },
        {
          data: 2,
          id: 0x4287, // DocTypeVersion
        },
        {
          data: 2,
          id: 0x4285, // DocTypeReadVersion
        },
      ],
    },
    {
      id: 0x18538067, // Segment
      data: [
        {
          id: 0x1549a966, // Info
          data: [
            {
              data: 1e6, // do things in millisecs (num of nanosecs for duration scale)
              id: 0x2ad7b1, // TimecodeScale
            },
            {
              data: "whammy",
              id: 0x4d80, // MuxingApp
            },
            {
              data: "whammy",
              id: 0x5741, // WritingApp
            },
            {
              data: doubleToString(info.duration),
              id: 0x4489, // Duration
            },
          ],
        },
        {
          id: 0x1654ae6b, // Tracks
          data: [
            {
              id: 0xae, // TrackEntry
              data: [
                {
                  data: 1,
                  id: 0xd7, // TrackNumber
                },
                {
                  data: 1,
                  id: 0x63c5, // TrackUID
                },
                {
                  data: 0,
                  id: 0x9c, // FlagLacing
                },
                {
                  data: "und",
                  id: 0x22b59c, // Language
                },
                {
                  data: "V_VP8",
                  id: 0x86, // CodecID
                },
                {
                  data: "VP8",
                  id: 0x258688, // CodecName
                },
                {
                  data: 1,
                  id: 0x83, // TrackType
                },
                {
                  id: 0xe0, // Video
                  data: [
                    {
                      data: info.width,
                      id: 0xb0, // PixelWidth
                    },
                    {
                      data: info.height,
                      id: 0xba, // PixelHeight
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 0x1f43b675, // Cluster
          data: [
            {
              data: 0,
              id: 0xe7, // Timecode
            },
          ].concat(
            frames.map(function (webp: any) {
              const START_CODE = "\x9d\x01\x2a";
              var block = makeSimpleBlock({
                discardable: 0,
                frame: webp.data.slice(webp.data.indexOf(START_CODE) - 3),
                invisible: 0,
                keyframe: 1,
                lacing: 0,
                trackNum: 1,
                timecode: Math.round(counter),
              });
              counter += webp.duration;
              return {
                data: block,
                id: 0xa3,
              };
            })
          ),
        },
      ],
    },
  ];
  return generateEBML(EBML);
}

// sums the lengths of all the frames and gets the duration, woo

function checkFrames(frames: any) {
  var width = frames[0].width;
  var height = frames[0].height;
  var duration = frames[0].duration;
  for (var i = 1; i < frames.length; i++) {
    if (frames[i].width !== width) {
      throw WebMGLError("Frame " + (i + 1) + " has a different width");
    }
    if (frames[i].height !== height) {
      throw WebMGLError("Frame " + (i + 1) + " has a different height");
    }
    if (frames[i].duration < 0) {
      throw WebMGLError("Frame " + (i + 1) + " has a weird duration");
    }
    duration += frames[i].duration;
  }
  return {
    duration: duration,
    width: width,
    height: height,
  };
}

function numToBuffer(num: number) {
  var parts = [];
  while (num > 0) {
    parts.push(num & 0xff);
    num = num >> 8;
  }
  return new Uint8Array(parts.reverse());
}

function strToBuffer(str: string) {
  // return new Blob([str])

  var arr = new Uint8Array(str.length);
  for (var i = 0; i < str.length; i++) {
    arr[i] = str.charCodeAt(i);
  }
  return arr;
  // this is slower
  // return new Uint8Array(str.split('').map(function(e){
  // 	return e.charCodeAt(0)
  // }))
}

// sorry this is ugly, and sort of hard to understand exactly why this was done
// at all really, but the reason is that there's some code below that i dont really
// feel like understanding, and this is easier than using my brain.

function bitsToBuffer(bits: string) {
  var data = [];
  var pad =
    bits.length % 8 ? new Array(1 + 8 - (bits.length % 8)).join("0") : "";
  bits = pad + bits;
  for (var i = 0; i < bits.length; i += 8) {
    data.push(parseInt(bits.substr(i, 8), 2));
  }
  return new Uint8Array(data);
}

function generateEBML(json: any) {
  var ebml = [];
  for (var i = 0; i < json.length; i++) {
    var data = json[i].data;
    // console.log(data)
    if (typeof data === "object") data = generateEBML(data);
    if (typeof data === "number") data = bitsToBuffer(data.toString(2));
    if (typeof data === "string") data = strToBuffer(data);
    // console.log(data)

    var len = data.size || data.byteLength;
    var zeroes = Math.ceil(Math.ceil(Math.log(len) / Math.log(2)) / 8);
    var size_str = len.toString(2);
    var padded =
      new Array(zeroes * 7 + 7 + 1 - size_str.length).join("0") + size_str;
    var size = new Array(zeroes).join("0") + "1" + padded;

    // i actually dont quite understand what went on up there, so I'm not really
    // going to fix this, i'm probably just going to write some hacky thing which
    // converts that string into a buffer-esque thing

    ebml.push(numToBuffer(json[i].id));
    ebml.push(bitsToBuffer(size));
    ebml.push(data);
  }
  if (window.Blob) {
    // In browser environment
    return new window.Blob(ebml, {
      type: "video/webm",
    });
  } else {
    var buffer = Buffer.from(ebml);
    return Uint8Array.from(buffer).buffer;
  }
}

// woot, a function that's actually written for this project!
// this parses some json markup and makes it into that binary magic
// which can then get shoved into the matroska comtainer (peaceably)

function makeSimpleBlock(data: any) {
  var flags = 0;
  if (data.keyframe) flags |= 128;
  if (data.invisible) flags |= 8;
  if (data.lacing) flags |= data.lacing << 1;
  if (data.discardable) flags |= 1;
  if (data.trackNum > 127) {
    throw WebMGLError("TrackNumber > 127 not supported");
  }
  var out =
    [data.trackNum | 0x80, data.timecode >> 8, data.timecode & 0xff, flags]
      .map(function (e) {
        return String.fromCharCode(e);
      })
      .join("") + data.frame;

  return out;
}

// here's something else taken verbatim from weppy, awesome rite?

function parseWebP(riff: any) {
  var VP8 = riff.RIFF[0].WEBP[0];

  var frame_start = VP8.indexOf("\x9d\x01\x2a"); // A VP8 keyframe starts with the 0x9d012a header
  for (var i = 0, c = []; i < 4; i++)
    c[i] = VP8.charCodeAt(frame_start + 3 + i);

  var width, height, tmp;

  // the code below is literally copied verbatim from the bitstream spec
  tmp = (c[1] << 8) | c[0];
  width = tmp & 0x3fff;
  tmp = (c[3] << 8) | c[2];
  height = tmp & 0x3fff;
  return {
    width: width,
    height: height,
    data: VP8,
    riff: riff,
  };
}

// i think i'm going off on a riff by pretending this is some known
// idiom which i'm making a casual and brilliant pun about, but since
// i can't find anything on google which conforms to this idiomatic
// usage, I'm assuming this is just a consequence of some psychotic
// break which makes me make up puns. well, enough riff-raff (aha a
// rescue of sorts), this function was ripped wholesale from weppy

function parseRIFF(string: any) {
  var offset = 0;
  var chunks: any = {};

  while (offset < string.length) {
    var id = string.substr(offset, 4);
    var len = parseInt(
      string
        .substr(offset + 4, 4)
        .split("")
        .map(function (i: any) {
          var unpadded = i.charCodeAt(0).toString(2);
          return new Array(8 - unpadded.length + 1).join("0") + unpadded;
        })
        .join(""),
      2
    );
    var data = string.substr(offset + 4 + 4, len);
    offset += 4 + 4 + len;
    chunks[id] = chunks[id] || [];

    if (id === "RIFF" || id === "LIST") {
      chunks[id].push(parseRIFF(data));
    } else {
      chunks[id].push(data);
    }
  }
  return chunks;
}

// here's a little utility function that acts as a utility for other functions
// basically, the only purpose is for encoding "Duration", which is encoded as
// a double (considerably more difficult to encode than an integer)
function doubleToString(num: number) {
  return [].slice
    .call(
      new Uint8Array(
        new Float64Array([num]).buffer // create a float64 array
      ), // extract the array buffer
      0
    ) // convert the Uint8Array into a regular array
    .map(function (e) {
      // since it's a regular array, we can now use map
      return String.fromCharCode(e); // encode all the bytes individually
    })
    .reverse() // correct the byte endianness (assume it's little endian for now)
    .join(""); // join the bytes in holy matrimony as a string
}

export class WebMGLVideo {
  frames: any[];
  duration: number;
  quality: number;

  constructor(speed: number, quality: number) {
    this.frames = [];
    this.duration = 1000 / speed;
    this.quality = quality || 0.8;
  }

  add(frame: any, duration?: number) {
    if (typeof duration !== "undefined" && this.duration) {
      throw WebMGLError("Cannot pass a duration if FPS is set");
    }
    if (!/^data:image\/webp;base64,/gi.test(frame)) {
      throw WebMGLError(
        "Input must be formatted properly as a base64 encoded DataURI of type image/webp"
      );
    }
    this.frames.push({
      image: frame,
      duration: duration || this.duration,
    });
  }

  compile() {
    if (this.frames.length === 0) {
      throw WebMGLError("You did not add any frame to the Video!");
    }
    return toWebM(
      this.frames.map(function (frame: any) {
        var webp: any = parseWebP(
          parseRIFF(window.atob(frame.image.slice(23)))
        );
        webp.duration = frame.duration;
        return webp;
      })
    );
  }
}

// function WebMGLVideo(speed: number, quality: number) {
//   // a more abstract-ish API
//   this.frames = [];
//   this.duration = 1000 / speed;
//   this.quality = quality || 0.8;
// }

// WebMGLVideo.prototype.add = function ;

// WebMGLVideo.prototype.compile = function ;
