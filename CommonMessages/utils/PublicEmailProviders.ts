const publicEmailProviders = [
    'gmail.com', // Gmail
    'yahoo.com', // Yahoo Mail
    'outlook.com', // Outlook.com
    'hotmail.com', // Outlook.com (formerly Hotmail)
    'aol.com', // AOL Mail
    'zoho.com', // Zoho Mail
    'protonmail.com', // ProtonMail
    'icloud.com', // iCloud Mail
    'mail.com', // Mail.com
    'gmx.com', // GMX Mail
    'gmx.net', // GMX Mail
    'yandex.com', // Yandex.Mail
    'tutanota.com', // Tutanota
    'tutanota.de', // Tutanota
    'fastmail.com', // FastMail
    'hushmail.com', // Hushmail
    'runbox.com', // Runbox
    'mailfence.com', // Mailfence
    'lavabit.com', // Lavabit
    'countermail.com', // CounterMail
    'posteo.de', // Posteo
    'librem.one', // Librem Mail
    'kolabnow.com', // Kolab Now
    'mailbox.org', // Mailbox.org
    'rackspace.com', // Rackspace Email
    'rediffmail.com', // Rediffmail
    'sapo.pt', // Sapo Mail
    'qq.com', // QQ Mail
    'seznam.cz', // Seznam - A popular Czech Republic email service
    'web.de', // Web.de - Common in Germany
    'orange.fr', // Orange - Widely used in France
    'virgilio.it', // Virgilio - Italian email provider
    'mail.ru', // Mail.ru - Russian email service
    'nate.com', // Nate - A South Korean internet company
    'daum.net', // Daum - Another South Korean provider
    'sina.com', // Sina - Major Chinese provider
    'sohu.com', // Sohu - Another Chinese provider
    'uol.com.br', // UOL - A Brazilian internet company
    'bol.com.br', // BOL - Brazilian Online
    'email.cz', // Email.cz - Another Czech provider
    'inbox.lv', // Inbox.lv - Widely used in Latvia
    'freenet.de', // Freenet - German provider
    'wp.pl', // Wirtualna Polska - Popular in Poland
    'onet.pl', // Onet - Another Polish provider
    'interia.pl', // Interia - Polish portal and email service
    'bluewin.ch', // Bluewin - Swiss email service
    'chello.at', // Chello - Austrian broadband provider
    'telstra.com', // Telstra - Australian telecommunications
    'bigpond.com', // BigPond - Telstra's internet service provider division in Australia
    'shaw.ca', // Shaw - Canadian telecommunications company
    'rogers.com', // Rogers - Another Canadian telecommunications company
    'optusnet.com.au', // Optus - Australian ISP
    'xtra.co.nz', // Xtra - New Zealand's largest ISP
    'terra.com.br', // Terra - Brazilian internet company
    'cox.net', // Cox - American internet service provider
    'tele2.it', // Tele2 - Italian branch of the European telecommunications operator
    'skynet.be', // Skynet - Belgian ISP
    'club-internet.fr', // Club-Internet - French ISP
    'alice.it', // Alice - Italian ISP
    'walla.co.il', // Walla - Israeli web portal
    'mweb.co.za', // MWeb - South African ISP
    'telus.net', // Telus - Canadian telecommunications company
    'ziggo.nl', // Ziggo - Dutch ISP
    'xs4all.nl', // XS4ALL - Dutch ISP known for its strong privacy policies
    'kpnmail.nl', // KPN - Dutch telecommunications
    'telenet.be', // Telenet - Belgian ISP
    'virginmedia.com', // Virgin Media - UK based ISP
    'bt.com', // BT - British Telecommunications
    'talktalk.co.uk', // TalkTalk - UK ISP
    'sasktel.net', // SaskTel - Canadian ISP
    'ntlworld.com', // NTL World - Part of Virgin Media in the UK
    'orange.net', // Orange - Former UK brand, now part of EE
    'wanadoo.fr', // Wanadoo - Former French ISP, now Orange
    'free.fr', // Free - French ISP
    'bbox.fr', // Bouygues Telecom - French ISP
    'earthlink.net', // EarthLink - U.S.-based ISP
    'comcast.net', // Comcast - Large U.S. ISP
    'centurylink.net', // CenturyLink - American telecommunications and ISP
    'charter.net', // Charter Communications - American telecommunications company
    'frontier.com', // Frontier Communications - American telecommunications provider
    'windstream.net', // Windstream - American ISP
    'mediacomcc.com', // Mediacom - American cable television and communications provider
    'rcn.com', // RCN - American telecommunications company
    'gci.net', // GCI - General Communication Inc., Alaska-based telecommunications company
    'q.com', // CenturyLink - Secondary domain for CenturyLink
    'cableone.net', // Cable One - American cable service provider
    'wowway.com', // WOW! Internet, Cable & Phone - U.S. service provider
    'tiscali.it', // Tiscali - Italian telecommunications company
    'virgin.net', // Virgin Net - Part of Virgin Media, UK
    'dodo.com.au', // Dodo - Australian ISP
    'iinet.net.au', // iiNet - Australian internet service provider
    'optonline.net', // Optimum Online - High-speed internet service by Optimum
    'pldt.com.ph', // PLDT - Philippine telecommunications company
    'telkom.net', // Telkom - Indonesian telecommunications company
    'singnet.com.sg', // SingNet - Singaporean ISP
    'pacbell.net', // Pacific Bell - Former American telecommunications company
    'bell.net', // Bell Canada - Canadian telecommunications company
    'shawmail.ca', // Shaw Communications - Canadian telecommunications company
    'rochester.rr.com', // Rochester - Part of Time Warner Cable's Road Runner service
    'excite.com', // Excite - Web portal and service provider
    'juno.com', // Juno - Internet service provider in the U.S.
    'netscape.net', // Netscape - American web services provider
    'netzero.net', // NetZero - Internet service provider in the U.S.
    'sbcglobal.net', // SBCGlobal - Former internet service provider, now part of AT&T
    'bellsouth.net', // BellSouth - Now part of AT&T, former telecommunications company
    'att.net', // AT&T - Internet service part of AT&T
    'verizon.net', // Verizon - American broadband and telecommunications company
    'coxmail.com', // Cox Communications - American private broadband company
    'btinternet.com', // BT Internet - Internet service by British Telecom
    'sky.com', // Sky Broadband - Internet service provider in the UK
    'ntlworld.com', // NTL World - Part of Virgin Media in the UK
    'clix.pt', // Clix - Portuguese internet service provider
    'telia.com', // Telia Company - Swedish multinational telecommunications company
    'laposte.net', // La Poste - French postal service provider
    'fibertel.com.ar', // Fibertel - Argentine broadband provider
    't-online.de', // T-Online - German ISP
    'webmail.co.za', // Webmail - South African email provider
    'aliceadsl.fr', // Alice ADSL - Former French ISP
    'vodafone.de', // Vodafone - German branch of the multinational telecommunications company
    'hexun.com', // Hexun - Chinese financial information provider
    'sfr.fr', // SFR - French telecommunications company
    'neuf.fr', // Neuf - Former French ISP, now part of SFR
    'optimum.net', // Optimum - American cable television company
    'umn.edu', // University of Minnesota - Educational institution email
    'moakt.com', // Moakt - Temporary email service
    'temp-mail.org', // Temp Mail - Provides disposable email addresses
    'guerrillamail.com', // Guerrilla Mail - Disposable temporary email service
    'mailinator.com', // Mailinator - Public email service that offers temporary email addresses
    'yopmail.com', // YopMail - Disposable email address service
    '10minutemail.com', // 10 Minute Mail - Temporary email service
    'throwawaymail.com', // ThrowAwayMail - Generates temporary emails for private use
    'trash-mail.com', // Trash-Mail - Another disposable email service
    'fakemail.net', // Fake Mail - Temporary, safe, anonymous, free, disposable email address
    'getnada.com', // Getnada - Disposable email service
    'gmial.com', // Common typo for Gmail, sometimes used for temporary services
    'outlook.es', // Outlook - Spanish version of Microsoft's email service
    'mailnesia.com', // Mailnesia - Disposable email service with auto visit feature
    'dispostable.com', // Dispostable - You pick a name, and you have a temporary email address
    'maildrop.cc', // MailDrop - Free disposable email address service
    'spamgourmet.com', // Spamgourmet - Provides disposable emails to prevent spam
    'anonymousemail.me', // AnonymousEmail - Send emails without revealing your identity
    'anonmails.de', // AnonMails - Anonymous and encrypted email service
    'secure-mail.biz', // Secure-Mail - Secure anonymous email service
    'mytemp.email', // MyTemp.email - Temporary disposable email service
    'tempmailaddress.com', // Temp Mail Address - Free application to generate temporary email address
    'temporary-email.com', // Temporary-Email - Provides temporary, secure, anonymous, free, disposable email addresses
    'emlhub.com', // EmlHub - Free disposable email service
    'inboxalias.com', // InboxAlias - Allows you to create temporary email addresses
    'mailtemporaire.fr', // Mail Temporaire - French disposable email service
    'fastmail.fm', // Fastmail - An email service known for its speed and privacy
    'sofort-mail.de', // Sofort-Mail - German disposable email service
    'emailondeck.com', // EmailOnDeck - Free, temporary email addresses for use on the internet
    'inbox.lv', // Inbox.lv - Latvian email provider, also offers a wide range of online services
    'mail.ee', // Mail.ee - Estonian free email service
    'euromail.hu', // EuroMail - Hungarian email provider
    'mail.bg', // Mail.bg - Bulgarian email service
    'post.cz', // Post.cz - Czech Republic email provider
    'ukr.net', // Ukr.net - Ukrainian email service
    'onet.eu', // Onet.eu - European domain for the Polish web portal Onet
    'autograf.pl', // Autograf.pl - Polish email service
    'vp.pl', // VP.pl - Another Polish email provider
    'poczta.fm', // Poczta.fm - Polish email service
    'o2.pl', // O2.pl - Email service provided by the O2 brand in Poland
    'citromail.hu', // Citromail - Hungarian email service known for simplicity and ease of use
    'freemail.hu', // Freemail - Hungarian free email service
    't-email.hu', // T-email - Hungarian Telekom's email service
    'azet.sk', // Azet.sk - Slovak email service
    'post.sk', // Post.sk - Another Slovak email provider
    'siol.net', // Siol.net - Slovenian internet communication company
    'amorki.pl', // Amorki.pl - Polish dating site with email service
    'seznam.sk', // Seznam.sk - Slovak branch of the Czech internet company Seznam
    'aon.at', // Aon.at - Austrian online service
    'elitemail.org', // EliteMail - Free email service provided by Elite Group
    'mailforspam.com', // MailForSpam - Disposable email service specifica
    'zoho.eu', // Zoho Europe - European operations of Zoho's email service
    'mailbox.hu', // Mailbox - Hungarian email provider
    'email.it', // Email.it - Italian email service provider
    'laposte.fr', // La Poste - French postal service with email offerings
    'poste.it', // Poste Italiane - Italian postal service with email offerings
    'mail.ru', // Mail.Ru - Russian internet company
    'yandex.ru', // Yandex - Russian multinational corporation offering email services
    'list.ru', // List.Ru - Another Russian email service by Mail.Ru Group
    'bk.ru', // BK.ru - Provided by Mail.Ru Group
    'inbox.ru', // Inbox.Ru - Mail.Ru's service
    'netcourrier.com', // NetCourrier - French webmail service
    'swissmail.org', // SwissMail - Swiss email provider focused on security
    'blueyonder.co.uk', // BlueYonder - UK based email service by Virgin Media
    'tele2.nl', // Tele2 Netherlands - Dutch part of the European telecommunications operator
    'home.nl', // Home.nl - Dutch residential internet provider
    'keemail.me', // KeeMail - Secure email service that allows anonymous email creation
    'safe-mail.net', // Safe-mail - Secure email service based in Israel
    'sina.cn', // Sina Mail - Chinese portal offering email services
    '163.com', // 163 Mail - Popular Chinese email service provided by NetEase
    '126.com', // 126 Mail - Another email service by NetEase, China
    'qq.com', // QQ Mail - Provided by Tencent in China
    'naver.com', // Naver - South Korean online platform
    'hanmail.net', // Hanmail - Email service provided by Daum Communications, South Korea
    'daum.net', // Daum - South Korean web portal offering email services
    'nate.com' // Nate - South Korean web portal with email services
  ]
  
  export default publicEmailProviders
  