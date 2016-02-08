'use strict';

var defaultPermissions = {
  c: {value: 'C', name: 'Create', displayOrder: '10'},
  r: {value: 'R', name: 'Read', displayOrder: '20'},
  u: {value: 'U', name: 'Update', displayOrder: '30'},
  d: {value: 'D', name: 'Delete', displayOrder: '40'},
  x: {value: 'X', name: 'Execute', displayOrder: '80'},
  f: {value: 'F', name: 'Full Control', displayOrder: '90'}
};

module.exports = {
  app: {
    title: 'MEAN.JS',
    description: 'Full-Stack JavaScript with MongoDB, Express, AngularJS, and Node.js',
    keywords: 'mongodb, express, angularjs, node.js, mongoose, passport',
    googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID || 'GOOGLE_ANALYTICS_TRACKING_ID'
  },
  port: process.env.PORT || 3000,
  host: process.env.HOST || '0.0.0.0',
  templateEngine: 'swig',
  // Session Cookie settings
  sessionCookie: {
    // session expiration is set by default to 24 hours
    maxAge: 24 * (60 * 60 * 1000),
    // httpOnly flag makes sure the cookie is only accessed
    // through the HTTP protocol and not JS/browser
    httpOnly: true,
    // secure cookie should be turned to true to provide additional
    // layer of security so that the cookie is set only when working
    // in HTTPS mode.
    secure: false
  },
  // sessionSecret should be changed for security measures and concerns
  sessionSecret: process.env.SESSION_SECRET || 'MEAN',
  // sessionKey is set to the generic sessionId key used by PHP applications
  // for obsecurity reasons
  sessionKey: 'sessionId',
  sessionCollection: 'sessions',
  logo: 'modules/core/client/img/brand/logo.png',
  favicon: 'modules/core/client/img/brand/favicon.ico',
  uploads: {
    profileUpload: {
      dest: './modules/users/client/img/profile/uploads/', // Profile upload destination path
      limits: {
        fileSize: 1*1024*1024 // Max file size in bytes (1 MB)
      }
    }
  },
  defaultPermissions : defaultPermissions,
  defaultRoles: [
    {
      name: 'admin',
      description: 'Administrators have full control of the application.',
      permissions: [
        defaultPermissions.c,
        defaultPermissions.r,
        defaultPermissions.u,
        defaultPermissions.d,
        defaultPermissions.x,
        defaultPermissions.f
      ]
    }, {
      name: 'user',
      description: 'Users have "signed up" and may view Landscapes.',
      permissions: [ defaultPermissions.r ]
    }, {
      name: 'manager',
      description: 'Managers have full access and may deploy Landscapes.',
      permissions: [
        defaultPermissions.r,
        defaultPermissions.u,
        defaultPermissions.d,
        defaultPermissions.x
      ]
    }
  ]
};
