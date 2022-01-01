﻿using System;

namespace WebEventApp.Models
{

    [Flags]
    public enum EventStatus : short
    {
        None = 1,
        Current = 2,
        Upcoming = 4,
        Expired = 8
    }
}
